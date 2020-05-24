import { Response, Level2Error } from '../../types/lvl2SDK'

export type ApiVersion = 'v1beta1' | 'v1beta2'

export type ENV = 'development' | 'production'

export interface ConfigParams {
  apiVersion: ApiVersion
  env: ENV
  apiHost:string
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
