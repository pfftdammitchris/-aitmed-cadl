import _ from 'lodash'
import dot from 'dot-object'
import store from '../../common/store'
import { mergeDeep, isObject } from '../../utils'
import { UnableToLocateValue } from '../errors'
import services from '../services'

export {
  isPopulated,
  replaceEidWithId,
  lookUp,
  populateKeys,
  attachFns,
  populateString,
  populateArray,
  populateObject,
  populateVals,
  replaceUint8ArrayWithBase64,
  replaceEvalObject,
  replaceIfObject,
}

/**
 * Maps ecos.eid to id.
 *
 * @param edge
 * @returns edge
 */
function replaceEidWithId(edge: Record<string, any>) {
  let output = Object.assign({}, edge)
  const { eid } = output
  if (eid) {
    const b64Id = store.utils.idToBase64(eid)
    output = { ...output, id: b64Id }
    delete output.eid
    return output
  } else {
    return edge
  }
}

/**
 * Merges keys in source object with objects in locations where keys match lookFor.
 *
 * @param PopulateKeysArgs
 * @param PopulateKeysArgs.source Object to populate.
 * @param PopulateKeysArgs.lookFor Symbols to lookFor in properties e.g ['..,.']
 * @param PopulateKeysArgs.locations
 * @returns Populated object.
 */
function populateKeys({
  source,
  lookFor,
  locations,
}: {
  source: Record<string, any>
  lookFor: string
  locations: Record<string, any>[]
}): Record<string, any> {
  let output = _.cloneDeep(source || {})
  Object.keys(output).forEach((key) => {
    if (key.startsWith(lookFor)) {
      let parent = {}
      let currKey = key
      if (lookFor === '..') {
        currKey = currKey.slice(1)
      }
      for (let location of locations) {
        try {
          const res = lookUp(currKey, location)
          if (res) {
            parent = res
          }
        } catch (error) {
          if (error instanceof UnableToLocateValue) {
            continue
          } else {
            throw error
          }
        }
      }
      if (Object.keys(parent).length && output[key]) {
        const mergedObjects = mergeDeep(
          populateKeys({ source: parent, lookFor, locations }),
          populateKeys({ source: output[key], lookFor, locations })
        )
        output = { ...output, ...mergedObjects }
        delete output[key]
      } else if (Object.keys(parent).length) {
        //TODO: test why it is undefined when .Edge:""
        //check SignUp page
        const mergedObjects = populateKeys({
          source: parent,
          lookFor,
          locations,
        })
        //TODO: pending unit test
        output = mergeDeep(mergedObjects, output)
        delete output[key]
      }
    } else if (isObject(output[key])) {
      output[key] = populateKeys({ source: output[key], lookFor, locations })
    } else if (Array.isArray(output[key])) {
      output[key] = output[key].map((elem) => {
        if (isObject(elem)) {
          return populateKeys({ source: elem, lookFor, locations })
        }
        return elem
      })
    }
  })
  return output
}

/**
 * Used to look up value of a key given the path and source locations to for the value in.
 *
 * @param directions  Path leading to the location of value
 * @param location Sources to look for value in.
 * @returns Whatever value that was attached to the property at the given directions.
 * @throws {UnableToLocateValue} When value is not found given the directions and location.
 */
function lookUp(directions: string, location: Record<string, any>): any {
  let arr = directions.split('.')

  try {
    const res = arr.slice(1).reduce((o, key) => {
      return o[key]
    }, location)
    return res
  } catch (error) {
    throw new UnableToLocateValue('value not found', error)
  }
}

/**
 * Checks whether or not an object has been de-referenced.
 *
 * @param item
 * @returns true if the object has already been dereferenced and false otherwise.
 *
 */
function isPopulated(item: string | Record<string, any>): boolean {
  let itemCopy = _.cloneDeep(item)
  let isPop: boolean = true
  if (isObject(itemCopy)) {
    for (let key of Object.keys(itemCopy)) {
      if (!isPop) return isPop
      if (isObject(itemCopy[key])) {
        isPop = isPopulated(itemCopy[key])
      } else if (Array.isArray(itemCopy[key])) {
        for (let elem of itemCopy[key]) {
          if (isObject(elem)) {
            isPop = isPopulated(elem)
          } else if (typeof elem === 'string') {
            if (elem.startsWith('.') || elem.startsWith('..')) {
              isPop = false
            }
            isPop = true
          } else {
            isPop = true
          }
        }
      } else if (typeof itemCopy[key] === 'string') {
        const currVal = itemCopy[key].toString()
        if (currVal.startsWith('.') || currVal.startsWith('..')) {
          isPop = false
        }
      }
    }
  }
  return isPop
}

/**
 * Attaches ecos functions to the object.
 *
 * @param cadlObject
 * @param dispatch
 * @returns The object with functions attached to it.
 */
function attachFns({
  cadlObject,
  dispatch,
}: {
  cadlObject: Record<string, any>
  dispatch: Function
}): Record<string, any> {
  //we need the pageName to use as a key to store the data
  //when using the dataKey
  let pageName
  if (Object.keys(cadlObject).length > 1) {
    pageName = 'Global'
  } else {
    pageName = Object.keys(cadlObject)[0]
  }
  return attachFnsHelper({
    pageName,
    cadlObject,
    dispatch,
  })

  function attachFnsHelper({
    pageName,
    cadlObject,
    dispatch,
  }: {
    pageName: string
    cadlObject: Record<string, any>
    dispatch: Function
  }): Record<string, any> {
    //traverse through the page object and look for the api keyword
    let output = _.cloneDeep(cadlObject || {})
    if (isObject(output)) {
      Object.keys(output).forEach((key) => {
        if (isObject(output[key])) {
          output[key] = attachFnsHelper({
            pageName,
            cadlObject: output[key],
            dispatch,
          })
        } else if (Array.isArray(output[key])) {
          output[key] = output[key].map((elem) => {
            if (isObject(elem))
              return attachFnsHelper({ pageName, cadlObject: elem, dispatch })
            return elem
          })
        } else if (typeof output[key] === 'string' && key === 'api') {
          //when api keyword is found we attach the corresponding ecos function to the current output which should be the value of get or store
          /**
           * get:output
           * store:output
           */
          const { api } = output
          //have this because api can be of shape 'builtIn.***'
          const apiSplit = api.split('.')
          const apiType = apiSplit[0]
          switch (apiType) {
            case 'ce': {
              output = isPopulated(output)
                ? [
                    `${output.dataOut ? output.dataOut : output.dataKey}.name`,
                    services('ce')({ pageName, apiObject: output, dispatch }),
                  ]
                : output
              break
            }
            case 'cd': {
              output = isPopulated(output)
                ? [
                    `${output.dataOut ? output.dataOut : output.dataKey}.name`,
                    services('cd')({ pageName, apiObject: output, dispatch }),
                  ]
                : output
              break
            }
            case 'cv': {
              output = isPopulated(output)
                ? [
                    `${output.dataOut ? output.dataOut : output.dataKey}.name`,
                    services('cv')({ pageName, apiObject: output, dispatch }),
                  ]
                : output
              break
            }
            case 'builtIn': {
              output = isPopulated(output)
                ? [
                    `${output.dataOut ? output.dataOut : output.dataKey}.name`,
                    services('builtIn')({
                      pageName,
                      apiObject: output,
                      dispatch,
                    }),
                  ]
                : output
              break
            }
            default: {
              output = isPopulated(output)
                ? services(apiType)({ pageName, apiObject: output, dispatch })
                : output
              break
            }
          }
        }
      })
    }
    return output
  }
}

/**
 * Returns a function that is used to evalutate actionType evalObject.
 *
 * @param EvalStateArgs
 * @param EvalStateArgs.pageName
 * @param EvalStateArgs.updateObject
 * @param EvalStateArgs.dispatch
 * @returns Function that runs the series of operations detailed in the updateObject.
 *
 */
function evalState({
  pageName,
  updateObject,
  dispatch,
}: {
  pageName: string
  updateObject: Record<string, any>
  dispatch: Function
}): Function {
  return async (): Promise<void> => {
    const res = await dispatch({
      type: 'eval-object',
      payload: { pageName, updateObject },
    })
    return res
  }
}

/**
 * Replaces the eval object, if any, with a function that performs the the actions detailed in the actionType evalObject
 *
 * @param ReplaceEvalObjectArgs
 * @param ReplaceEvalObjectArgs.cadlObject
 * @param ReplaceEvalObjectArgs.dispatch
 * @returns Object with evalObject replaced by a function.
 *
 */
function replaceEvalObject({
  pageName,
  cadlObject,
  dispatch,
}: {
  pageName: string
  cadlObject: Record<string, any>
  dispatch: Function
}): Record<string, any> {
  const cadlCopy = _.cloneDeep(cadlObject || {})
  Object.keys(cadlCopy).forEach(async (key) => {
    if (
      key === 'object' &&
      cadlCopy.actionType === 'evalObject' &&
      (Array.isArray(cadlCopy[key]) || isObject(cadlCopy[key]))
    ) {
      const updateObject = _.cloneDeep(cadlCopy[key])

      cadlCopy[key] = evalState({ pageName, updateObject, dispatch })
      //used to update global state after user signin
      if (
        pageName === 'SignIn' ||
        pageName === 'CreateNewAccount' ||
        pageName === 'SignUp'
      ) {
        await dispatch({
          type: 'add-fn',
          payload: {
            pageName,
            fn: evalState({ pageName, updateObject, dispatch }),
          },
        })
      }
    } else if (isObject(cadlCopy[key])) {
      cadlCopy[key] = replaceEvalObject({
        pageName,
        cadlObject: cadlCopy[key],
        dispatch,
      })
    } else if (Array.isArray(cadlCopy[key])) {
      cadlCopy[key] = cadlCopy[key].map((elem) => {
        if (isObject(elem)) {
          return replaceEvalObject({ pageName, cadlObject: elem, dispatch })
        }
        return elem
      })
    }
  })
  return cadlCopy
}

/**
 * Returns a function that is used to evalutate if block.
 *
 * @param RunIfArgs
 * @param RunIfArgs.pageName
 * @param RunIfArgs.updateObject
 * @param RunIfArgs.dispatch
 * @returns Function that runs the series of operations detailed in the IfObject.
 *
 */
function runIf({
  pageName,
  updateObject,
  dispatch,
}: {
  pageName: string
  updateObject: Record<string, any>
  dispatch: Function
}): Function {
  return async (): Promise<void> => {
    await dispatch({
      type: 'if-object',
      payload: { pageName, updateObject },
    })
    return
  }
}
/**
 * Replaces the if object, if any, with a function that performs the the actions detailed in the if block
 *
 * @param ReplaceIfObjectArgs
 * @param ReplaceIfObjectArgs.cadlObject
 * @param ReplaceIfObjectArgs.dispatch
 * @returns Object with IfObject replaced by a function.
 *
 */
function replaceIfObject({
  pageName,
  cadlObject,
  dispatch,
}: {
  pageName: string
  cadlObject: Record<string, any>
  dispatch: Function
}): Record<string, any> {
  const cadlCopy = _.cloneDeep(cadlObject || {})
  Object.keys(cadlCopy).forEach(async (key) => {
    if (key === 'if' && Array.isArray(cadlCopy[key])) {
      const updateObject = _.cloneDeep(cadlCopy[key])

      cadlCopy[key] = runIf({ pageName, updateObject, dispatch })
    } else if (isObject(cadlCopy[key])) {
      cadlCopy[key] = replaceIfObject({
        pageName,
        cadlObject: cadlCopy[key],
        dispatch,
      })
    } else if (Array.isArray(cadlCopy[key])) {
      cadlCopy[key] = cadlCopy[key].map((elem) => {
        if (isObject(elem)) {
          return replaceIfObject({ pageName, cadlObject: elem, dispatch })
        }
        return elem
      })
    }
  })
  return cadlCopy
}

/**
 * Used to de-reference a string by looking for value in locations.
 *
 * @param PopulateStringArgs
 * @param PopulateStringArgs.source Object that has values that need to be replaced
 * @param PopulateStringArgs.lookFor Item to look for in object
 * @param PopulateStringArgs.locations Array of objects that may contain the values for the source object
 * @param PopulateStringArgs.path The path to the value that will be changed.
 * @param PopulateStringArgs.dispatch Function to change the state.
 * @param PopulateStringArgs.pageName
 *
 * @returns De-referenced object.
 */
function populateString({
  source,
  lookFor,
  skip,
  locations,
  path,
  dispatch,
  pageName,
}: {
  source: string
  lookFor: string
  skip?: string[]
  locations: Record<string, any>[]
  path?: string[]
  dispatch?: Function
  pageName?: string
}): any {
  if (skip && skip.includes(source)) return source
  if (!source.startsWith(lookFor)) return source
  let currVal = source
  let replacement
  if (lookFor === '~') {
    currVal = '.myBaseUrl'
  } else if (lookFor === '_' && currVal.includes('.')) {
    let charArr = currVal.split('')
    let copyPath = _.clone(path) || []
    let currChar = charArr.shift()
    while (currChar !== '.' && charArr.length > 0) {
      if (currChar === '_') {
        copyPath.pop()
      }
      currChar = charArr.shift()
    }
    replacement = '.' + copyPath.concat(charArr.join('')).join('.')
    return replacement
  } else if (lookFor === '..') {
    currVal = currVal.slice(1)
  } else if (lookFor === '=') {
    if (source.startsWith('=..')) {
      currVal = currVal.slice(2)
    } else if (source.startsWith('=.')) {
      currVal = currVal.slice(1)
    }
  }
  if (currVal.startsWith('.')) {
    currVal = currVal.slice(1)
  }
  for (let location of locations) {
    try {
      replacement = dot.pick(currVal, location)
      // replacement = lookUp(currVal, location)
      if (replacement && lookFor == '~') {
        replacement = replacement + source.substring(2)
        break
      } else if (replacement && replacement !== source) {
        if (
          typeof replacement === 'string' &&
          replacement.startsWith(lookFor)
        ) {
          return populateString({
            source: replacement,
            lookFor,
            skip,
            locations,
            path,
            pageName,
            dispatch,
          })
        } else {
          break
        }
      }
    } catch (error) {
      if (error instanceof UnableToLocateValue) {
        continue
      } else {
        throw error
      }
    }
  }
  if (replacement !== undefined && replacement !== source) {
    return replacement
  }
  return source
}

/**
 * Dereference values in an array data structure.
 *
 * @param PopulateArrayArgs
 * @param PopulateArrayArgs.source Object that has values that need to be replaced.
 * @param PopulateArrayArgs.lookFor Item to look for in object
 * @param PopulateArrayArgs.locations Array of objects that may contain the values for the source object
 * @param PopulateArrayArgs.path
 * @param PopulateArrayArgs.dispatch Function to change the state.
 * @param PopulateArrayArgs.pageName
 *
 * @returns Dereferenced array.
 */
function populateArray({
  source,
  lookFor,
  skip,
  locations,
  path,
  dispatch,
  pageName,
}: {
  source: any[]
  lookFor: string
  skip?: string[]
  locations: Record<string, any>[]
  path: string[]
  dispatch?: Function
  pageName?: string
}): any[] {
  let sourceCopy = _.cloneDeep(source || [])
  var previousKey = path[path.length - 1] || ''
  let replacement = sourceCopy.map((elem, i) => {
    let index = '[' + i + ']'
    if (Array.isArray(elem)) {
      return populateArray({
        source: elem,
        skip,
        lookFor,
        locations,
        path: path.slice(0, -1).concat(previousKey + index),
        dispatch,
        pageName,
      })
    } else if (isObject(elem)) {
      if (
        !(
          ('actionType' in elem &&
            elem.actionType === 'evalObject' &&
            elem.object &&
            isObject(elem.object)) ||
          Array.isArray(elem.object)
        )
      ) {
        return populateObject({
          source: elem,
          skip,
          lookFor,
          locations,
          path: path.slice(0, -1).concat(previousKey + index),
          dispatch,
          pageName,
        })
      }
    } else if (typeof elem === 'string') {
      return populateString({
        source: elem,
        skip,
        lookFor,
        locations,
        path: path.slice(0, -1).concat(previousKey + index),
        dispatch,
        pageName,
      })
    }
    return elem
  })

  return replacement
}

/**
 * De-references source object by looking for items in the given locations.
 *
 * @param PopulateObjectArgs
 * @param PopulateObjectArgs.source Object that has values that need to be replaced
 * @param PopulateObjectArgs.lookFor Item to look for in object
 * @param PopulateObjectArgs.locations Array of objects that may contain the values for the source object
 * @param PopulateObjectArgs.skip
 * @param PopulateObjectArgs.path
 * @param PopulateObjectArgs.dispatch
 * @param PopulateObjectArgs.pageName
 *
 * @returns Dereferenced object
 */
function populateObject({
  source,
  lookFor,
  locations,
  skip = [],
  path = [],
  dispatch,
  pageName,
}: {
  source: Record<string, any>
  lookFor: string
  locations: Record<string, any>[]
  skip?: string[]
  path?: string[]
  dispatch?: Function
  pageName?: string
}): Record<string, any> {
  let sourceCopy = _.cloneDeep(source || {})
  Object.keys(sourceCopy).forEach((key) => {
    let index = key
    if (!skip.includes(key) && key !== 'dataKey' && key !== 'if') {
      if (isObject(sourceCopy[key])) {
        if (
          !(
            ('actionType' in sourceCopy[key] &&
              sourceCopy[key].actionType === 'evalObject' &&
              sourceCopy[key].object &&
              isObject(sourceCopy[key].object)) ||
            Array.isArray(sourceCopy[key].object)
          )
        ) {
          sourceCopy[key] = populateObject({
            source: sourceCopy[key],
            lookFor,
            locations,
            skip,
            path: path.concat(index),
            dispatch,
            pageName,
          })
        }
      } else if (Array.isArray(sourceCopy[key])) {
        sourceCopy[key] = populateArray({
          source: sourceCopy[key],
          skip,
          lookFor,
          locations,
          path: path.concat(index),
          dispatch,
          pageName,
        })
      } else if (typeof sourceCopy[key] === 'string') {
        sourceCopy[key] = populateString({
          source: sourceCopy[key],
          skip,
          lookFor,
          locations,
          path: path.concat(index),
          dispatch,
          pageName,
        })
      }
    }
  })

  return sourceCopy
}

/**
 * De-reference source object by looking for multiple items in multiple locations.
 *
 * @param PopulateValsArgs
 * @param PopulateValsArgs.source Object that needs de-referencing.
 * @param PopulateValsArgs.lookFor An array of items to look for e.g ['.','..']
 * @param PopulateValsArgs.locations Locations to look for values.
 * @param PopulateValsArgs.skip Keys to skip in the de-referencing process.
 * @param PopulateValsArgs.pageName
 * @param PopulateValsArgs.dispatch Function to alter the state.
 * @returns
 */
function populateVals({
  source,
  lookFor,
  locations,
  skip,
  pageName,
  dispatch,
}: {
  source: Record<string, any>
  lookFor: string[]
  skip?: string[]
  locations: any[]
  pageName?: string
  dispatch?: Function
}): Record<string, any> {
  let sourceCopy = _.cloneDeep(source || {})

  for (let symbol of lookFor) {
    sourceCopy = populateObject({
      source: sourceCopy,
      lookFor: symbol,
      skip,
      locations,
      pageName,
      dispatch,
    })
  }

  return sourceCopy
}

/**
 * Replaces Uint8Array values with base64 values
 *
 * @param source Object that needs values replaced.
 * @returns Object that has had Uint8Array values mapped to base64.
 */
function replaceUint8ArrayWithBase64(
  source: Record<string, any> | any[]
): Record<string, any> {
  let sourceCopy = _.cloneDeep(source || {})
  if (isObject(source)) {
    Object.keys(sourceCopy).forEach((key) => {
      if (sourceCopy[key] instanceof Uint8Array) {
        sourceCopy[key] = store.level2SDK.utilServices.uint8ArrayToBase64(
          sourceCopy[key]
        )
      } else if (isObject(sourceCopy[key])) {
        sourceCopy[key] = replaceUint8ArrayWithBase64(sourceCopy[key])
      } else if (
        Array.isArray(sourceCopy[key]) &&
        !(sourceCopy[key] instanceof Uint8Array)
      ) {
        sourceCopy[key] = sourceCopy[key].map((elem) =>
          replaceUint8ArrayWithBase64(elem)
        )
      }
    })
  } else if (Array.isArray(source)) {
    sourceCopy = source.map((elem) => replaceUint8ArrayWithBase64(elem))
  }
  return sourceCopy
}
