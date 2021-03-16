import { CommonTypes, XOR } from '../../common/types'
import { NoteType } from './types'

export type ContentParams = XOR<
  { content: Blob | Record<any, any> },
  {
    content: string
    type: NoteType
  }
>

// ContentToBlob
export interface ContentToBlob {
  (content: string | Blob | Record<any, any>, type?: NoteType): Blob
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
