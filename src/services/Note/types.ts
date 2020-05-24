import * as NoteUtilsTypes from './utilsTypes'
import AiTmedError from '../../common/AiTmedError'

export interface NoteDocumentDeat {
  url: string
  sig: string
  exptime: string
}

export interface NoteDocumentName {
  title: string
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
export interface Note {
  id: string
  owner_id: string
  notebook_id: string

  info: {
    title: string
    type: string
    content: string | Blob | Record<any, any> | null

    tags: string[]
  }

  created_at: number
  modified_at: number
  // modified_by: string

  isEditable: boolean

  isEncrypt: boolean
  isGzip: boolean
  isOnServer: boolean
  size: number

  isBroken: boolean
  error: AiTmedError | null
}

// Create
export type CreateParams = {
  notebook_id: string | Uint8Array
  title: string
  tags?: string[]
  dataType?: number
} & NoteUtilsTypes.ContentParams
export interface Create {
  (params: CreateParams): Promise<Note>
}

// Retrieve
export interface Retrieve {
  (id: string | Uint8Array): Promise<Note>
}

// Remove
export interface Remove {
  (id: string | Uint8Array): Promise<Note>
}

// Update
export type UpdateFields = NoteUtilsTypes.UpdateNoteFields
export interface Update {
  (id: string | Uint8Array, fields: UpdateFields): Promise<Note>
}

// Save
export interface Save {
  (id: string | Uint8Array, fields: UpdateFields): Promise<Note>
}

// List
export type ListOptions = NoteUtilsTypes.ListDocsOptions
export interface ListReturn {
  ids: string[]
  mapper: Record<string, Note>
}
export interface List {
  (notebook_id: string | Uint8Array, options?: ListOptions): Promise<ListReturn>
}

// ListSharedNotes
export interface ListSharedNotesOptions {
  tags?: string[]
  count?: number
  edit_mode?: number
  sort_by?: 0 | 1 | 2
}
export interface ListSharedNotesReturn {
  ids: string[]
  mapper: Record<string, Note>
}
export interface ListSharedNotes {
  (notebook_id: string | Uint8Array, options?: ListSharedNotesOptions): Promise<ListSharedNotesReturn>
}
