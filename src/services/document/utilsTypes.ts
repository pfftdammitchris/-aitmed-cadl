import { DATA_TYPE_LIST, MEDIA_TYPE_LIST } from '../../common/DType'
import { CommonTypes, XOR } from '../../common/types'

import * as NoteTypes from '../Note/types'

export type ContentParams = XOR<
  { content: Blob | Record<any, any> },
  {
    content: string
    type: 'text/plain' | 'text/html' | 'text/markdown'
  }
>

// ContentToBlob
export interface ContentToBlob {
  (
    content: string | Blob | Record<any, any>,
    type?: 'text/plain' | 'text/html' | 'text/markdown'
  ): Blob
}

// EncryptData
export interface ProduceEncryptDataReturn {
  data: Uint8Array
  isEncrypt: boolean
}
export interface ProduceEncryptData {
  (
    data: Uint8Array | Blob,
    esak?: string | Uint8Array,
    publicKeyOfReceiver?: string
  ): Promise<ProduceEncryptDataReturn>
}

// ProduceGzipData
export interface ProduceGzipDataReturn {
  data: Uint8Array
  isGzip: boolean
}
export interface ProduceGzipData {
  (data: Uint8Array | Blob): Promise<ProduceGzipDataReturn>
}

export type DocumentToNoteParams = {
  document: CommonTypes.Doc
  edge?: CommonTypes.Edge
  esakOfCurrentUser?: Uint8Array
}
// DocumentToNote
export interface DocumentToNote {
  (DocumentToNoteParams): Promise<any>
}

// RetrieveNote
export interface RetrieveNote {
  (id: string | Uint8Array, edge?: CommonTypes.Edge): Promise<NoteTypes.Note>
}

// UpdateNote
export type UpdateNoteFields = {
  notebook_id?: string | Uint8Array
  title?: string
  tags?: string[]
} & ContentParams
export interface UpdateNote {
  (id: string | Uint8Array, fields: UpdateNoteFields, save?: boolean): Promise<
    NoteTypes.Note
  >
}

// ListDocs
export interface ListDocsOptions {
  shared?: Boolean
  count?: number
  sort_by?: 0 | 1 | 2

  // flags
  isOnServer?: boolean
  isGzip?: boolean
  isBinary?: boolean
  isEncrypted?: boolean
  hasExtraKey?: boolean
  isEditable?: boolean

  dataType?: number | typeof DATA_TYPE_LIST[number]
  mediaType?: number | typeof MEDIA_TYPE_LIST[number]

  // types?: (NoteTypes.NoteType)[]
  // tags?: string[]
}
export interface ListDocs {
  (edge: CommonTypes.Edge, options?: ListDocsOptions): Promise<
    CommonTypes.Doc[]
  >
}
