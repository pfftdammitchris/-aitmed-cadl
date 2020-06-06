import store from '../../common/store'
import { retrieveEdge } from '../../common/retrieve'
import AiTmedError from '../../common/AiTmedError'

import DType from '../../common/DType'
import { CommonTypes } from '../../common/types'

import * as NoteTypes from './types'

import {
  documentToNote,
  retrieveNote,
  contentToBlob,
  produceEncryptData,
  produceGzipData,
  updateNote,
  listDocs,
  CONTENT_SIZE_LIMIT,
} from './utils'

/**
 * @param params
 * @param params.notebook_id: string
 * @param params.title: string
 * @param params.content: string | Blob
 * @param params.type: 0 | 1 | 2 | 3 | 10 | 11 | 12
 * @param params.tags?: string[]
 * @param params.dataType?: number
 * @returns Promise<Note>
 */
export const create: NoteTypes.Create = async ({
  notebook_id,
  title,
  tags = [],
  content,
  type,
  dataType = 0,
}) => {
  const edge = await retrieveEdge(notebook_id)
  if (!edge) throw new AiTmedError({ name: 'NOTEBOOK_NOT_EXIST' })

  const dType = new DType()
  dType.dataType = dataType
  // Permission
  dType.isEditable = true

  // Content to Blob
  const blob = await contentToBlob(content, type)
  dType.setMediaType(blob.type)

  // Gzip
  const { data: gzipData, isGzip } = await produceGzipData(blob)
  dType.isGzip = isGzip
  dType.isOnServer = gzipData.length < CONTENT_SIZE_LIMIT

  // Encryption

  let esak: Uint8Array | string = ''
  let publicKeyOfReceiver: string = ''
  if (edge.besak && edge.sig) {
    esak = edge.besak
    if (edge.sig instanceof Uint8Array) {
      publicKeyOfReceiver = await store.level2SDK.utilServices.uint8ArrayToBase64(edge.sig)
    } else {
      publicKeyOfReceiver = edge.sig
    }
  } else if (edge.eesak && edge.sig) {
    esak = edge.eesak
    if (edge.sig instanceof Uint8Array) {
      publicKeyOfReceiver = await store.level2SDK.utilServices.uint8ArrayToBase64(edge.sig)
    } else {
      publicKeyOfReceiver = edge.sig
    }
  }

  const { data, isEncrypt } = await produceEncryptData(gzipData, esak, publicKeyOfReceiver)
  dType.isEncrypted = isEncrypt

  const bs64Data = await store.level2SDK.utilServices.uint8ArrayToBase64(data)
  dType.isBinary = false

  const name: NoteTypes.NoteDocumentName = {
    title,
    tags,
    type: blob.type,
  }

  // data must be base64 in name field
  if (dType.isOnServer) name.data = bs64Data

  const response = await store.level2SDK.documentServices
    .createDocument({
      eid: edge.eid,
      type: dType.value,
      name,
      size: blob.size,
    })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)
  if (!response || !response.data) {
    throw new AiTmedError({
      name: 'UNKNOW_ERROR',
      message: 'Note -> create -> createDocument -> no response',
    })
  }

  const document: CommonTypes.Doc = response.data
  const { deat } = document

  if (!dType.isOnServer && deat !== null && deat && deat.url && deat.sig) {
    await store.level2SDK.documentServices
      .uploadDocumentToS3({ url: deat.url, sig: deat.sig, data: bs64Data })
      .then(store.responseCatcher)
      .catch(store.errorCatcher)
  }
  const note = await retrieveNote(document.id)
  return note
}

/**
 * @param id: string | Uint8Array
 */
export const retrieve: NoteTypes.Retrieve = async (id) => {
  const note = await retrieveNote(id)
  return note
}

/**
 * @param id: string | Uint8Array
 * @returns Promise<Note>
 */
export const remove: NoteTypes.Remove = async (id) => {
  const note = await retrieve(id)
  await store.level2SDK.documentServices
    .deleteDocument([note.id])
    .then(store.responseCatcher)
    .catch(store.errorCatcher)
  return note
}

/**
 * @param id: string
 * @param params
 * @param params.notebook_id?: string
 * @param params.title?: string
 * @param params.content?: string | Blob
 * @param params.tags?: string[]
 * @returns Promise<Note>
 */
export const update: NoteTypes.Update = async (id, fields) => {
  const note = await updateNote(id, fields, false)
  return note
}

/**
 * @param id: string
 * @param params
 * @param params.notebook_id?: string
 * @param params.title?: string
 * @param params.content?: string | Blob
 * @param params.tags?: string[]
 * @returns Promise<Note>
 */
export const save: NoteTypes.Save = async (id, fields) => {
  const note = await updateNote(id, fields, true)
  return note
}

/**
 * @param notebook_id
 * @param options
 * @param options.shared?: Boolean
 * @param options.types?: (NoteTypes | NoteFileTypes)[]
 * @param options.tags?: string[]
 * @param options.count?: number
 * @param options.edit_mode?: number
 * @param options.sort_by?: 0 | 1 | 2
 */
export const list: NoteTypes.List = async (notebook_id, options) => {
  const edge = await retrieveEdge(notebook_id)
  if (!edge) throw new AiTmedError({ name: 'NOTEBOOK_NOT_EXIST' })
  const documents = await listDocs(edge, options)

  const ids: string[] = []
  const mapper: Record<string, NoteTypes.Note> = {}
  for (const document of documents) {
    const note = await documentToNote({ document, edge })
    ids.push(note.id)
    mapper[note.id] = note
  }
  return { ids, mapper }
}
/**
 * @param notebook_id
 * @param options
 * @param options.tags?: string[]
 * @param options.count?: number
 * @param options.edit_mode?: number
 * @param options.sort_by?: 0 | 1 | 2
 */
export const listSharedNotes: NoteTypes.ListSharedNotes = async (rootNotebookId, options) => {
  const { data: edges } = await store.level2SDK.edgeServices.retrieveEdge({
    idList: [rootNotebookId], options: {
      ...options,
      type: 10001,
      xfname: 'refid'
    }
  })
  const { data: rootEdge } = await store.level2SDK.edgeServices.retrieveEdge({
    idList: [rootNotebookId]
  })


  if (!edges) throw new AiTmedError({ name: 'NOTEBOOK_NOT_EXIST' })

  const sharedNotebooksWithRootNoteBook = [...edges, ...rootEdge]
  const ids: string[] = []
  const mapper: Record<string, NoteTypes.Note> = {}
  if (sharedNotebooksWithRootNoteBook.length) {
    const vidOfCurrentUserB64 = localStorage.getItem('user_vid')
    const esakOfCurrentUser = sharedNotebooksWithRootNoteBook.filter((edge) => {
      let vidOfCurrentUserUint8Array = store.level2SDK.utilServices.uint8ArrayToBase64(edge.evid)
      return vidOfCurrentUserB64 === vidOfCurrentUserUint8Array
    }).map(edge => edge.eesak).pop()

    await Promise.all(sharedNotebooksWithRootNoteBook.map(async (edge) => {
      const documents = await listDocs(edge, options)
      for (const document of documents) {
        const note = await documentToNote({ document, edge, esakOfCurrentUser })
        ids.push(note.id)
        mapper[note.id] = note
      }
      return documents
    })).then(() => {
      return { ids, mapper }
    }).catch(() => {
      throw new AiTmedError({ name: 'DECRYPTING_NOTES_FAIL' })
    })
  }
  return { ids, mapper }
}

/**
 * Todo:
 * 1. retrieveDocument with id - check the note is exist or not
 * 2.
 * @param id
 * @param invite_phone_number
 * @param edit_mode
 */
// export async function share(
//   id: string | Uint8Array,
//   invite_phone_number: string,
//   edit_mode: number,
// ): Promise<void> {
//   console.log('Note->share', id, invite_phone_number, edit_mode)
// }

/**
 * Todo:
 * 1. retrieveDocument with id - check the note is exist or not
 * 2.
 * @param id
 * @param invited_phone_number
 */
// export async function unshare(
//   id: string | Uint8Array,
//   invited_phone_number: string,
// ): Promise<void> {
//   console.log('Note->unshare', id, invited_phone_number)
// }
