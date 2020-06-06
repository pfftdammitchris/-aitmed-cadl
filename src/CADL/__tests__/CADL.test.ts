import CADL from '../CADL'
import { isObject } from '../../utils'
import {
    UnableToRetrieveYAML
} from '../errors'
import { defaultConfig } from '../../config'

describe('CADL', () => {

    describe('defaultObject', () => {
        test('defaultObject returns an Object', () => {
            const cadl = new CADL({ ...defaultConfig })

            return cadl['defaultObject']('https://s3.us-east-2.amazonaws.com/public.aitmed.com/cadl/aitmed_0.203/BaseDataModel_en.yml').then(data => {
                expect(isObject(data)).toBe(true)
            })
        })
        test('defaultObject rejects an invalid url', () => {

            const cadl = new CADL({ ...defaultConfig })

            expect(cadl['defaultObject'](cadl['_pageUrl'])).rejects
        })
        test('defaultObject throws UnableToRetrieveYAML if something goes wrong in fetching the yaml', async () => {

            const cadl = new CADL({ ...defaultConfig })

            await expect(cadl['defaultObject'](cadl['_pageUrl'])).rejects.toThrowError(UnableToRetrieveYAML)
        })
    })
})