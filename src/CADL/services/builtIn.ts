import _ from 'lodash'

import { Account } from '../../services'
import { isObject } from '../../utils'
import store from '../../common/store'
import encryptionServices from './ecc'
import stringServices from './string'
import objectServices from './object'
import arrayServices from './array'
import numberService from './number'
import dateService from './date'
import searchService from './search'
import apiRequestService from './apiRequest'
import ecos from './ecos'
import utils from './utils'
import typeCheck from './typeCheck'
import math from './math'
import FCM from './fcm'
import payment from './payment'

import Document from '../../services/Document'
export { builtIn }

function builtIn({ pageName, apiObject, dispatch }) {
  //TODO: replace when builtInFns allows an argument for fn name
  const pathArr = apiObject.api.split('.').slice(1)
  const builtInFnsObj = builtInFns()
  const builtInFn = _.get(builtInFnsObj, pathArr)
  return async (input?: any) => {
    //@ts-ignore
    const { dataKey, dataIn, dataOut } = _.cloneDeep(apiObject || {})
    const currentVal = await dispatch({
      type: 'get-data',
      payload: {
        dataKey: dataIn ? dataIn : dataKey,
        pageName,
      },
    })
    let res: any
    try {
      if (store.env === 'test') {
        console.log(
          `%cBuiltIn Fn:${pathArr} Request `,
          `background: purple; color: white; display: block;`,
          {
            ...currentVal,
            ...input,
          },
        )
      }
      //TODO: make signature more generic
      const data = await builtInFn({
        ...currentVal,
        ...input,
      })
      res = data
      if (store.env === 'test') {
        console.log(
          `%cBuiltIn Fn:${pathArr} Response`,
          `background: purple; color: white; display: block;`,
          res,
        )
      }
    } catch (error) {
      throw error
    }
    if ((Array.isArray(res) && res.length > 0) || isObject(res)) {
      await dispatch({
        type: 'update-data',
        //TODO: handle case for data is an array or an object
        payload: {
          pageName,
          dataKey: dataOut ? dataOut : dataKey,
          data: res,
        },
      })
      await dispatch({
        type: 'emit-update',
        payload: {
          pageName,
          dataKey: dataOut ? dataOut : dataKey,
          newVal: res,
        },
      })
    }
    return res
  }
}
/**
 * @param dispatch Function to change the state.
 * @returns Object of builtIn functions.
 */
//TODO: allow argument Fn name
//TODO: consider returning an interface instead
export default function builtInFns(dispatch?: Function) {
  return {
    string: stringServices,
    eccNaCl: encryptionServices,
    object: objectServices,
    array: arrayServices,
    number: numberService,
    date: dateService,
    search: searchService,
    apiRequest: apiRequestService,
    typeCheck,
    ecos,
    utils,
    math,
    FCM,
    payment,
    async createNewAccount(args) {
      const { phoneNumber, password, userName, firstName, lastName } = args.name
      let validPhoneNumber
      if (phoneNumber.includes('-')) {
        validPhoneNumber = phoneNumber.replace(/-/g, '')
      } else {
        validPhoneNumber = phoneNumber
      }
      validPhoneNumber = args.name.countryCode + ' ' + validPhoneNumber
      const data = await Account.create(
        validPhoneNumber,
        password,
        args.name?.verificationCode,
        { userName, firstName, lastName },
        args.type,
      )
      let sk = localStorage.getItem('sk')
      if (dispatch) {
        await dispatch({
          type: 'update-data',
          //TODO: handle case for data is an array or an object
          payload: {
            pageName: 'builtIn',
            dataKey: 'builtIn.UserVertex',
            data: { ...data, sk },
          },
        })
      }
      return data
    },
    async signIn({ phoneNumber, password, verificationCode }) {
      let validPhoneNumber
      if (phoneNumber.includes('-')) {
        validPhoneNumber = phoneNumber.replace(/-/g, '')
      } else {
        validPhoneNumber = phoneNumber
      }
      const data = await Account.login(
        validPhoneNumber,
        password,
        verificationCode,
      )
      let sk = localStorage.getItem('sk')
      if (dispatch) {
        await dispatch({
          type: 'update-data',
          //TODO: handle case for data is an array or an object
          payload: {
            pageName: 'builtIn',
            dataKey: 'builtIn.UserVertex',
            data: { ...data, sk },
          },
        })
      }
      return data
    },
    async loginByPassword(password) {
      const data = await Account.loginByPassword(password)
      let sk = localStorage.getItem('sk')
      if (dispatch) {
        await dispatch({
          type: 'update-data',
          //TODO: handle case for data is an array or an object
          payload: {
            pageName: 'builtIn',
            dataKey: 'builtIn.UserVertex',
            data: { ...data, sk },
          },
        })
      }
    },
    storeCredentials({ pk, sk, esk, userId }) {
      localStorage.setItem('sk', sk)
      localStorage.setItem('pk', pk)
      localStorage.setItem('esk', esk)
      localStorage.setItem('user_vid', userId)
      return
    },

    currentDateTime: (() => Date.now())(),

    async SignInOk(): Promise<boolean> {
      const status = await Account.getStatus()
      if (status.code !== 0) {
        return false
      }
      return true
    },
    async uploadDocument({
      title,
      tags = [],
      content,
      type,
      dataType = 0,
    }): Promise<Record<string, any>> {
      const globalStr = localStorage.getItem('Global')
      const globalParse = globalStr !== null ? JSON.parse(globalStr) : null

      if (!globalParse) {
        throw new Error('There was no rootNotebook found.Please sign in.')
      }
      const edge_id = globalParse.rootNotebook.edge.id

      const res = await Document.create({
        edge_id,
        title,
        tags,
        content,
        type,
        dataType,
      })
      if (res) {
        return { docName: res?.name?.title, url: res?.deat?.url }
      }
      return res
    },
    isIOS() {
      if (typeof window !== 'undefined') {
        const userAgent = window.navigator.userAgent || window.navigator.vendor
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
          return true
        }
      }
      return false
    },
    isAndroid() {
      if (typeof window !== 'undefined') {
        const userAgent = window.navigator.userAgent || window.navigator.vendor
        if (/android/i.test(userAgent)) {
          return true
        }
      }
      return false
    },
    stringCompare(string1: string, string2: string) {
      return string1 === string2
    },
    async downloadFromS3(url) {
      const response =
        await store.level2SDK.documentServices.downloadDocumentFromS3({ url })
      return response?.data
    },
    cleanLocalStorage() {
      store.level2SDK.Account.logoutClean()
      localStorage.removeItem('Global')
      return
    },
  }
}

