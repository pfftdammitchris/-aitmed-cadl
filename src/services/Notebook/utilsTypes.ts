import { CommonTypes } from '../../common/types'

import * as NotebookTypes from './types'

/**
 * Notebook Utils
 */

// EdgeToNotebook
export interface EdgeToNotebook {
  (edge: CommonTypes.Edge): NotebookTypes.Notebook
}

// RetrieveNotebook
export interface RetrieveNotebook {
  (id: string | Uint8Array): Promise<NotebookTypes.Notebook>
}

// ListEdges
export interface ListEdgesParams {
  shared?: Boolean
  count?: number
  edit_mode?: number
  sort_by?: 0 | 1 | 2
  type?: number,
  xfname?: string
  loid?: string | Uint8Array
  isEncrypt?: Boolean,
  obfname?:string
  scondition?:string
}
export interface ListEdges {
  (params?: ListEdgesParams): Promise<CommonTypes.Edge[]>
}
