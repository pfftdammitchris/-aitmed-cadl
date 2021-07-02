export enum RootTypes {
  docRoot = 10000,
}

export type CADL_OBJECT = Record<string, any>

export type BASE_DATA_MODEL = Record<string, any>

export interface DataModel {
  store: Function | Record<string, any>
  get: Function | Record<string, any>
  objectType: string
  dataModel: Record<string, any>
}

export interface CADLARGS {
  configUrl: string
  cadlVersion: 'test' | 'stable'
  aspectRatio?: number
  dbConfig: any
}
