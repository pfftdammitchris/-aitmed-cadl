import 'core-js/stable'
import 'regenerator-runtime'
import SDK from '@aitmed/ecos-lvl2-sdk'

import AiTmedError, { getErrorCode } from '../AiTmedError'
import { compareUint8Arrays } from '../../utils'

import {
  ResponseCatcher,
  ErrorCatcher,
  Utils,
} from './types'

import { APIVersion, ENV, ConfigProps } from '../types'


const defaultResponseCatcher: ResponseCatcher = (response) => {
  return response
}

const defaultErrorCatcher: ErrorCatcher = (error) => {
  const code = getErrorCode(error.name)
  if (code === -1 && error.name !== 'UNKNOW_ERROR') {
    throw error
  } else {
    throw new AiTmedError({ code, message: error.message })
  }
}

export default class Store {
  public _env: ENV
  public readonly level2SDK: SDK
  public readonly utils: Utils

  public responseCatcher: ResponseCatcher = defaultResponseCatcher
  public errorCatcher: ErrorCatcher = defaultErrorCatcher

  constructor({ apiVersion, apiHost, env, configUrl }: ConfigProps) {
    this._env = env
    this.level2SDK = new SDK({ apiVersion, apiHost, env, configUrl })

    const idToBase64 = (id: Uint8Array | string): string => {
      if (typeof id === 'string') {
        return id
      } else {
        return this.level2SDK.utilServices.uint8ArrayToBase64(id)
      }
    }

    const idToUint8Array = (id: Uint8Array | string): Uint8Array => {
      if (typeof id === 'string') {
        return this.level2SDK.utilServices.base64ToUint8Array(id)
      } else {
        return id
      }
    }

    this.utils = {
      idToBase64,
      idToUint8Array,
      compareUint8Arrays,
    }
  }


  set apiVersion(value: APIVersion) {
    this.level2SDK.apiVersion = value
  }

  get apiVersion() {
    return this.level2SDK.apiVersion
  }

  set env(value: ENV) {
    this.level2SDK.env = value
  }

  get env() {
    return this.level2SDK.env
  }

  get apiHost() {
    return this.level2SDK.apiHost
  }
  set apiHost(value: string) {
    this.level2SDK.apiHost = value
  }

  get configUrl() {
    return this.level2SDK.configUrl
  }

  set configUrl(value: string) {
    this.level2SDK.configUrl = value
  }



  public getConfig() {
    return this.level2SDK.getConfigData()
  }

  /**
   * @param catcher if null, reset the catcher to be default
   */
  public setResponseCatcher(catcher: ResponseCatcher = defaultResponseCatcher) {
    if (this.env === 'development') {
      this.responseCatcher = catcher
    }
  }

  /**
   * @param catcher if null, reset the catcher to be default
   */
  public setErrorCatcher(catcher: ErrorCatcher = defaultErrorCatcher) {
    if (this.env === 'development') {
      this.errorCatcher = catcher
    }
  }
}
