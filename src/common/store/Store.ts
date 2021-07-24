import 'core-js/stable'
import 'regenerator-runtime'
import lvl2SDK from '@aitmed/ecos-lvl2-sdk'

import AiTmedError, { getErrorCode } from '../AiTmedError'
import { compareUint8Arrays } from './utils'

import {
  ResponseCatcher,
  ErrorCatcher,
  Utils,
  ConfigParams,
  APIVersion,
  ENV,
} from './types'

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
  public readonly level2SDK: lvl2SDK
  public readonly utils: Utils

  public responseCatcher: ResponseCatcher = defaultResponseCatcher
  public errorCatcher: ErrorCatcher = defaultErrorCatcher
  public noodlInstance: any
  public currentLatitude: any
  public currentLongitude: any
  public drugbankToken: any
  constructor({ apiVersion, apiHost, env, configUrl }: ConfigParams) {
    this._env = env
    const sdkEnv = env === 'test' ? 'development' : 'production'
    this.level2SDK = new lvl2SDK({
      apiVersion,
      apiHost,
      env: sdkEnv,
      configUrl,
    })

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
    this._env = value
  }

  get env() {
    return this._env
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
}
