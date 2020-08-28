import {
  CommonTypes,
  Level2Response as Response,
  Level2Error,
  DocumentTypes,
  Status,
} from '@aitmed/ecos-lvl2-sdk'

export { CommonTypes, Response, Level2Error, DocumentTypes, Status }

export type APIVersion = string

export type ENV = 'test' | 'stable'

export interface ConfigProps {
  configUrl: string
  cadlVersion: 'test' | 'stable'
}

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U
