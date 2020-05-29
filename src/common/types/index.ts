export type APIVersion = string

export type ENV = 'development' | 'production'

export interface ConfigProps {
  configUrl: string
  env: ENV
  cadlVersion: string
}
