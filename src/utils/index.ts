import pako from 'pako'
import YAML from 'yaml'
import axios from 'axios'
import { UnableToParseYAML, UnableToRetrieveYAML, InvalidDestination } from '../CADL/errors'
import { CADLResponse } from '../common/Response'

export const compareUint8Arrays = (
    u8a1: Uint8Array,
    u8a2: Uint8Array,
): boolean => {
    if (u8a1.length !== u8a2.length) return false
    for (let i = 0; i < u8a1.length; i++) {
        if (u8a1[i] !== u8a2[i]) {
            return false
        }
    }
    return true
}

export const gzip = (data: Uint8Array) => {
    return pako.gzip(data)
}

export const ungzip = (data: Uint8Array) => {
    return pako.ungzip(data)
}

export function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item))
}

//TODO: write unit tests
export function mergeDeep(target, source) {
    let output = Object.assign({}, target)
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] })
                } else if (isObject(target[key])) {
                    output[key] = mergeDeep(target[key], source[key])
                } else {
                    output[key] = source[key]
                }
            } else {
                Object.assign(output, { [key]: source[key] })
            }
        })
    }
    return output
}

//TODO: write unit tests
/**
 * 
 * @param cadlYAML string 
 * @returns Record<string, any> -cadlObject
 * @throws UnableToParseYAML -if unable to parse yaml file
 * 
 */
export function validateCADL(cadlYAML: string): Record<string, any> {
    try {
        let cadlObject = YAML.parse(cadlYAML)
        return cadlObject
    } catch (error) {
        throw new UnableToParseYAML(`Unable to parse yaml: ${cadlYAML}`, error)
    }
}

//TODO: write unit tests
/**
 * 
 * @param url string 
 * @returns Record<string, any>
 * @throws UnableToRetrieveYAML -if unable to retrieve cadlYAML
 * @throws UnableToParseYAML -if unable to parse yaml file
 */
export async function fetchCADLObject(url: string): Promise<Record<string, any>> {
    let cadlYAML, cadlObject
    try {
        const { data } = await axios.get(url)
        cadlYAML = data
    } catch (error) {
        throw new UnableToRetrieveYAML(error.message)
    }

    try {
        cadlObject = YAML.parse(cadlYAML)
    } catch (error) {
        throw new UnableToParseYAML(error.message)
    }

    return cadlObject
}

//TODO: write unit tests
export async function fetchAll(url) {
    let cadlEndpointObject
    let result: CADLResponse[] = []

    //fetch cadlEndpoint
    try {
        cadlEndpointObject = await fetchCADLObject(url)
    } catch (error) {
        throw error
    }

    if (cadlEndpointObject) {
        const { page: yamlList, baseUrl, fileSuffix } = cadlEndpointObject
        //TODO: adjust to be more general
        const baseUrlWithCADLVersion = baseUrl.replace('${cadlVersion}', '0.203')
        for (let page of yamlList) {
            const pageName = page.split('_').pop()
            let cadlYAML, cadlObject
            let isValid = false
            let err: Error[] = []
            try {
                let url
                if (pageName === 'BaseCSS') {
                    url = `${baseUrlWithCADLVersion}${pageName}${fileSuffix}`
                } else {
                    url = `${baseUrlWithCADLVersion}${pageName}_en${fileSuffix}`
                }
                const { data } = await axios.get(url)
                cadlYAML = data
            } catch (error) {
                err.push(new UnableToRetrieveYAML(error.message))
            }

            if (!err.length) {
                try {
                    cadlObject = YAML.parse(cadlYAML)
                    isValid = true
                } catch (error) {
                    err.push(new UnableToParseYAML(error.message))
                }
            }

            if (!err.length) {
                const destinationErrors = valPageJump(cadlObject, yamlList)
                if (destinationErrors.length) {
                    isValid = false
                    err.push(...destinationErrors)
                }
            }

            let cadlResponse = new CADLResponse({ isValid, cadlObject, error: err, pageName })
            result.push(cadlResponse)
        }
    }
    return result

}

//TODO: write unit tests
export function valPageJump(cadlObject: Record<string, any>, validPages: string[]): InvalidDestination[] {
    const cadlCopy = Object.assign({}, cadlObject)
    let errors: InvalidDestination[] = []
    searchAndVal(cadlCopy)

    function searchAndVal(cadlObject) {
        for (let key in cadlObject) {
            if (isObject(cadlObject[key])) {
                searchAndVal(cadlObject[key])
            } else if (Array.isArray(cadlObject[key])) {
                for (let elem of cadlObject[key]) {
                    if (isObject(elem)) {
                        searchAndVal(elem)
                    }
                }
            } else {
                if (key === 'destination') {
                    if (!validPages.includes(cadlObject[key])) {
                        errors.push(new InvalidDestination(`${cadlObject[key] !== '' ? cadlObject[key] : null} is not a valid page destination.`))
                    }
                }
            }
        }
        return
    }

    return errors
}