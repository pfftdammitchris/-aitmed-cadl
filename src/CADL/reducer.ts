import _ from 'lodash'
import produce, { Draft } from 'immer'
import moment from 'moment'
import { isObject } from '../utils'
import type CADL from './CADL'

export type Action<T extends string = string> = { type: T } & Record<
  string,
  any
>

const createProducer = <T extends string>(
  fn: (draft: Draft<CADL['root']>, action: Action<T>) => any,
) => {
  return (
    draft: Draft<CADL['root']>,
    action: Action<T> & Record<string, any>,
  ): CADL['root'] => {
    return fn(draft, action)
  }
}

const ADD_BUILTIN_FNS = createProducer((draft, action) => {
  for (let [key, val] of Object.entries(action.payload.builtInFns)) {
    _.set(draft['builtIn'], key, val)
  }
})

const DELETE_PAGE = createProducer((draft, action) => {
  delete draft[action.payload.pageName]
})

const EDIT_DRAFT = createProducer((draft, action) =>
  action.payload.callback(draft),
)

const SET_VALUE = createProducer((draft, action) => {
  const { pageName, dataKey, value, replace } = action.payload
  let currVal
  let newVal = value
  if (!replace) {
    //used to merge new value to existing value ref
    if (typeof pageName === 'undefined') {
      currVal = _.get(draft, dataKey)
    } else {
      currVal = _.get(draft[pageName], dataKey)
    }
  }
  /**
   * CHECK HERE FOR DOC REFERENCE ISSUES
   */
  //console.log('Cadl set value line:2367', action.payload)
  if (isObject(currVal) && isObject(newVal)) {
    if ('doc' in newVal) {
      // for loading existing docs
      if (!Array.isArray(currVal.doc) && Array.isArray(newVal.doc)) {
        currVal.doc = []
        currVal.doc.push(...newVal.doc)
        // for adding new doc
      } else if (!Array.isArray(currVal.doc) && isObject(newVal.doc)) {
        // currVal.doc = []
        // currVal.doc.push(newVal.doc)
        currVal.doc = newVal.doc
      } else if ('id' in currVal) {
        newVal = _.merge(currVal, newVal.doc)
      } else {
        currVal.doc.length = 0
        currVal.doc.push(...newVal.doc)
      }
    } else {
      newVal = _.merge(currVal, newVal)
    }
  } else if (Array.isArray(currVal) && Array.isArray(newVal)) {
    currVal.length = 0
    currVal.push(...newVal)
  } else if (typeof pageName === 'undefined') {
    _.set(draft, dataKey, newVal)
  } else {
    _.set(draft[pageName], dataKey, newVal)
  }
})

const SET_ROOT_PROPERTIES = createProducer((draft, action) => {
  const { properties } = action.payload
  for (let [key, val] of Object.entries(properties)) {
    _.set(draft, key, val)
  }
})

const SET_LOCAL_PROPERTIES = createProducer((draft, action) => {
  const { properties, pageName } = action.payload
  for (let [key, val] of Object.entries(properties)) {
    _.set(draft[pageName], key, val)
  }
})

const SET_CACHE = createProducer((draft, action) => {
  _.set(draft['apiCache'], action.payload.cacheIndex, {
    data: action.payload.data,
    timestamp: moment(Date.now()).toString(),
  })
})

export const producer = {
  ADD_BUILTIN_FNS,
  DELETE_PAGE,
  EDIT_DRAFT,
  SET_CACHE,
  SET_LOCAL_PROPERTIES,
  SET_ROOT_PROPERTIES,
  SET_VALUE,
}

function reducer<T extends keyof typeof producer>(
  state: CADL['root'],
  action: Action<T>,
) {
  return produce(state, (draft) => void producer[action.type]?.(draft, action))
}

export default reducer
