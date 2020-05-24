export type APIVersion = string

export type ENV = 'development' | 'production'

export interface ConfigProps {
    apiHost: string
    apiVersion: APIVersion
    configUrl: string
    env: ENV
  }
  