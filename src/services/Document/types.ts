import * as NoteUtilsTypes from '../Note/utilsTypes'

export interface NoteDocumentDeat {
  url: string
  sig: string
  exptime: string
}

export interface NoteDocumentName {
  title: string
  nonce?: string
  user?: string
  tags: string[]
  edit_mode?: number
  type: string
  isEncrypt?: boolean
  isOnS3?: boolean
  isBinary?: boolean
  isGzip?: boolean
  data?: string
}

// export type NoteType =
//   | 'text/plain'
//   | 'application/json'
//   | 'text/html'
//   | 'text/markdown'
//   | 'image/*'
//   | 'application/pdf'
//   | 'video/*'
//   | string

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
  title: string
  user?: string
  tags?: string[]
  type?: number
  dataType?: number
  dTypeProps?: Record<string, any>
  paymentNonce?: string
} & NoteUtilsTypes.ContentParams

export interface Create {
  (params: CreateParams): Promise<any>
}

// Retrieve
export interface Retrieve {
  (id: string | Uint8Array): Promise<any>
}

// Remove
export interface Remove {
  (id: string | Uint8Array): Promise<any>
}

// Update
export type UpdateFields = NoteUtilsTypes.UpdateNoteFields
export interface Update {
  (id: string | Uint8Array, fields: UpdateFields): Promise<any>
}
