import { CommonTypes } from '../../common/types'
import { NotebookTypes } from '../Notebook'
import { NoteTypes } from '../Note'

import * as AccountTypes from './types'

/**
 * Account Utils Types
 */
export interface DecodeUID {
  (uid: string): { userId: string; phone_number: string }
}
export interface GenerateUser {
  (edge: CommonTypes.Edge, profile: AccountTypes.Profile | null): Promise<AccountTypes.User>
}

export interface CreateRootEdge {
  (): Promise<NotebookTypes.Notebook>
}

export interface RetrieveRootEdge {
  (): Promise<CommonTypes.Edge>
}

export interface CreateProfileNote {
  (rootId: string, profile?: Omit<AccountTypes.Profile, 'roles'>): Promise<
    NoteTypes.Note
  >
}

export interface CreateProfile {
  (rootId: string | Uint8Array, profile: AccountTypes.Profile): Promise<
    NoteTypes.Note
  >
}

export interface RemoveProfile {
  (id: string | Uint8Array, note: NoteTypes.Note): void
}

export interface RetrieveProfile {
  (rootId: string | Uint8Array): Promise<{
    noteId: string
    profile: AccountTypes.Profile
  } | null>
}
