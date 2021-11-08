import * as DocumentUtilsTypes from './utilsTypes'

export interface NoteDocumentDeat {
  url: string
  sig: string
  exptime: string
}

export interface NoteDocumentName {
  title: string
  nonce?: string
  targetRoomName?: string
  user?: string
  tags: string[]
  edit_mode?: number
  type: string
  isEncrypt?: boolean
  isOnS3?: boolean
  isBinary?: boolean
  isGzip?: boolean
  data?: string
  sesk?: string
  aesk?: string
}

export type NoteType =
  | 'text/plain'
  | 'application/json'
  | 'text/html'
  | 'text/markdown'
  | 'image/*'
  | 'application/pdf'
  | 'video/*'

/**
 *  edit_mode: Decimal number which can be converted to be ninary
 *  |   0    |  0   |  0   |
 *  | invite | edit | view |
 *  0 - unable
 *  1 - able
 *
 */

// Create
export type CreateParams = {
  edge_id: string | Uint8Array
  fid?: string | Uint8Array
  reid?: string | Uint8Array
  title: string
  user?: string
  sesk?: string
  aesk?: string
  targetRoomName?: string
  tags?: string[]
  tage?: number
  type?: number
  dataType?: number
  mediaType?: NoteType
  dTypeProps?: Record<string, any>
  paymentNonce?: string
  jwt?: string
  dispatch?: Function
} & DocumentUtilsTypes.ContentParams

export interface Create {
  (params: CreateParams): Promise<any>
}
