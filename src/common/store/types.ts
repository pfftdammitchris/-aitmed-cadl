import { Response, Level2Error } from '../../common/types'
import * as CommonTypes from '../types'
export * from '../types'

export interface ConfigParams {
  apiVersion?: CommonTypes.APIVersion
  env: CommonTypes.ENV
  apiHost?: string
  configUrl: string
}

export interface ResponseCatcher {
  (response: Response): Response | any
}

export interface ErrorCatcher {
  (error: Level2Error | any): void
}

export interface Utils {
  idToBase64: (id: Uint8Array | string) => string
  idToUint8Array: (id: Uint8Array | string) => Uint8Array
  compareUint8Arrays: (u8a1: Uint8Array, u8a2: Uint8Array) => boolean
}
