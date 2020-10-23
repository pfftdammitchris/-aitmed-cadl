import { CommonTypes, DocumentTypes } from '../../common/types'

import AiTmedError from '../../common/AiTmedError'
import { retrieveEdge, retrieveDocument } from '../../common/retrieve'
import store from '../../common/store'
import { gzip, ungzip } from '../../utils'

import DType from '../../common/DType'

import * as NoteTypes from './types'
import * as NoteUtilsTypes from './utilsTypes'

export const CONTENT_SIZE_LIMIT = 32768

/**
 * @param content: string | Blob
 * @param type: text/plain | application/json | text/html | text/markdown | image/* | application/pdf | video/* | string
 * @returns Blob
 */
export const contentToBlob: NoteUtilsTypes.ContentToBlob = (content, type) => {
  /* Convert content to be blob */
  let blob
  if (typeof content === 'string') {
    blob = new Blob([content], { type })
  } else if (content instanceof Blob) {
    blob = content
  } else {
    try {
      const jsonStr = JSON.stringify(content)
      blob = new Blob([jsonStr], { type: 'application/json' })
    } catch (error) {
      throw new AiTmedError({
        name: 'NOTE_CONTENT_INVALID',
        message: error.message,
      })
    }
  }
  return blob
}

/**
 *
 * @param data: Uint8Array | Blob
 * @param besak?: string | Uint8Array
 * @returns Promise<obj>
 * @returns obj.data: Uint8Array
 * @returns obj.isEncrypt: boolean
 */
export const produceEncryptData: NoteUtilsTypes.ProduceEncryptData = async (
  _data,
  esak,
  publicKeyOfReceiver
) => {
  // Make sure data is Uint8Array
  let data: Uint8Array =
      _data instanceof Blob
        ? await store.level2SDK.utilServices.blobToUint8Array(_data)
        : _data,
    isEncrypt = false
  if (typeof esak !== 'undefined' && esak !== '' && publicKeyOfReceiver) {
    /* Encryption */
    try {
      data = await store.level2SDK.commonServices.encryptData(
        esak,
        publicKeyOfReceiver,
        data
      )
      isEncrypt = true
    } catch (error) {}
  }
  return { data, isEncrypt }
}

/**
 *
 * @param _data Uint8Array | Blob
 * @returns Promise<obj>
 * @returns obj.data: Uint8Array
 * @returns obj.isGzip: boolean
 */
export const produceGzipData: NoteUtilsTypes.ProduceGzipData = async (
  _data
) => {
  // Make sure data is Uint8Array
  let u8a =
    _data instanceof Blob
      ? await store.level2SDK.utilServices.blobToUint8Array(_data)
      : _data

  const data = gzip(u8a)
  const isGzip = data.length < u8a.length
  return { data: isGzip ? data : u8a, isGzip }
}

/**
 *
 * @param document: Doc
 * @param edge?: Edge
 * @returns Promise<Note>
 */
export const documentToNote: NoteUtilsTypes.DocumentToNote = async ({
  document,
  _edge,
  esakOfCurrentUser,
}) => {
  // Validate Edge
  const edge =
    typeof _edge === 'undefined' ? await retrieveEdge(document.eid) : _edge
  if (edge === null)
    throw new AiTmedError({
      name: 'UNKNOW_ERROR',
      message: 'Note -> documentToNote -> retrieveEdge -> edge is null',
    })

  //TODO
  //currently commented since does not allow comparison between shared notebook
  //and docs from root notebook
  // if (
  //   !store.utils.compareUint8Arrays(
  //     <Uint8Array>edge.eid,
  //     <Uint8Array>document.eid,
  //   )
  // ) {
  //   throw new AiTmedError({ name: 'NOTEBOOK_ID_NOT_MATCH' })
  // }

  const name: NoteTypes.NoteDocumentName = document.name
  const contentType = parseInt(name.type) === 0 ? 'text/plain' : name.type
  const deat: NoteTypes.NoteDocumentDeat | null = document.deat

  // DType
  const isOldDataStructure =
    typeof name.isOnS3 !== 'undefined' ||
    typeof name.isGzip !== 'undefined' ||
    typeof name.isBinary !== 'undefined' ||
    typeof name.isEncrypt !== 'undefined' ||
    typeof name.edit_mode !== 'undefined'

  const dType = isOldDataStructure ? new DType() : new DType(document.type)

  if (isOldDataStructure) {
    if (typeof name.isOnS3 !== 'undefined') dType.isOnServer = !name.isOnS3
    else dType.isOnServer = true

    if (typeof name.isGzip !== 'undefined') dType.isGzip = name.isGzip
    if (typeof name.isBinary !== 'undefined') dType.isBinary = name.isBinary
    if (typeof name.isEncrypt !== 'undefined')
      dType.isEncrypted = name.isEncrypt

    if (typeof name.edit_mode !== 'undefined')
      dType.isEditable = !!name.edit_mode

    dType.setMediaType(name.type)
  }

  // Get data
  let content: string | Blob | Record<any, any> | null = null,
    isBroken = false,
    error: AiTmedError | null = null
  try {
    let data: Uint8Array
    if (dType.isOnServer) {
      if (name.data !== undefined) {
        // Get from name.data
        data = await store.level2SDK.utilServices.base64ToUint8Array(name.data)
      } else {
        throw new AiTmedError({
          name: 'UNKNOW_ERROR',
          message: 'name.data is undefined',
        })
      }
    } else {
      // Download from S3
      if (deat !== null && deat.url) {
        const response = await store.level2SDK.documentServices
          .downloadDocumentFromS3({ url: deat.url })
          .then(store.responseCatcher)
          .catch(store.errorCatcher)
        if (!response) throw 'no response'
        data = dType.isBinary
          ? (response.data as Uint8Array)
          : await store.level2SDK.utilServices.base64ToUint8Array(
              response.data as string
            )
      } else {
        throw 'deat.url is missing'
      }
    }

    // Decryption
    const edgeHasBesak = edge.besak && edge.besak !== ''
    const edgeHasEesak = edge.eesak && edge.eesak !== ''
    if (dType.isEncrypted && (edgeHasBesak || edgeHasEesak)) {
      let esak
      if (esakOfCurrentUser) {
        esak = esakOfCurrentUser
      } else {
        esak = edgeHasBesak ? edge.besak : edge.eesak
      }
      let publicKeyOfReceiver: string
      if (edge.sig) {
        if (edge.sig instanceof Uint8Array) {
          publicKeyOfReceiver = store.level2SDK.utilServices.uint8ArrayToBase64(
            edge.sig
          )
        } else {
          publicKeyOfReceiver = edge.sig
        }
        data = await store.level2SDK.commonServices.decryptData(
          esak,
          publicKeyOfReceiver,
          data
        )
      } else if (!edge.sig && edge.type === 10001) {
        const pkLocalStorage = localStorage.getItem('pk')
        publicKeyOfReceiver = pkLocalStorage ? pkLocalStorage : ''
        data = await store.level2SDK.commonServices.decryptData(
          esak,
          publicKeyOfReceiver,
          data
        )
      } else if (edge.type === 10000) {
        const pkLocalStorage = localStorage.getItem('pk')
        publicKeyOfReceiver = pkLocalStorage ? pkLocalStorage : ''
        data = await store.level2SDK.commonServices.decryptData(
          esak,
          publicKeyOfReceiver,
          data
        )
      }
    }
    // Ungzip
    if (dType.isGzip) data = ungzip(data)
    const blob = await store.level2SDK.utilServices.uint8ArrayToBlob(
      data,
      contentType
    )

    if (/^text\//.test(blob.type)) {
      content = await new Response(blob).text()
    } else if (blob.type === 'application/json') {
      const jsonStr = await new Response(blob).text()
      try {
        content = JSON.parse(jsonStr)
      } catch (error) {
        throw new AiTmedError({
          name: 'UNKNOW_ERROR',
          message: 'Note -> utils -> documentToNote -> JSON.parse failed',
        })
      }
    } else {
      content = blob
    }
  } catch (reason) {
    if (typeof reason === 'string') {
      error = new AiTmedError({
        name: 'DOWNLOAD_FROM_S3_FAIL',
        message: `Note -> documentToNote -> ${reason}`,
      })
    } else {
      error = reason
    }
    content = null
    isBroken = true
  }

  return {
    id: store.utils.idToBase64(document.id),
    owner_id: store.utils.idToBase64(edge.bvid),
    notebook_id: store.utils.idToBase64(document.eid),

    info: {
      title: name.title,
      type: contentType,
      content,
      tags: name.tags || [],
    },

    created_at: document.ctime * 1000,
    modified_at: document.mtime * 1000,

    isEditable: dType.isEditable,

    isEncrypt: dType.isEncrypted,
    isGzip: dType.isGzip,
    isOnServer: dType.isOnServer,
    size: document.size,

    isBroken,
    error,
  }
}

/**
 *
 * @param id: Uint8Array | string
 * @param _edge?: Edge
 * @returns Promise<Note>
 */
export const retrieveNote: NoteUtilsTypes.RetrieveNote = async (id, _edge) => {
  const document = await retrieveDocument(id)
  if (!document) {
    throw new AiTmedError({ name: 'NOT_A_NOTE' })
  }
  const note = await documentToNote({ document, _edge })
  return note
}

/**
 * @param id: string | Uint8Array
 * @param fields
 * @param fields.notebook_id?: string
 * @param fields.title?: string
 * @param fields.content?: string | Blob
 * @param type?: text/plain | application/json | text/html | text/markdown | image/* | application/pdf | video/* | string
 * @param fields.tags?: string[]
 * @param save?: boolean
 * @returns Promise<Note>
 */
export const updateNote: NoteUtilsTypes.UpdateNote = async (
  id,
  { notebook_id, title, content, mediaType, tags },
  save = false
) => {
  // Get original document
  const document = await retrieveDocument(id)
  if (!document) {
    throw new AiTmedError({ name: 'NOT_A_NOTE' })
  }

  // Get edge
  let edge
  if (typeof notebook_id !== 'undefined') {
    edge = await retrieveEdge(notebook_id)
  } else {
    edge = await retrieveEdge(document.eid)
  }
  if (!edge) throw new AiTmedError({ name: 'NOTEBOOK_NOT_EXIST' })
  if (
    !store.utils.compareUint8Arrays(
      <Uint8Array>edge.eid,
      <Uint8Array>document.eid
    )
  ) {
    throw new AiTmedError({ name: 'NOTEBOOK_ID_NOT_MATCH' })
  }

  // Update Params
  const params: DocumentTypes.UpdateDocumentArgs = {
    id: document.id,
    eid: edge.eid,
  }
  if (save) params.fid = document.id

  // Update name
  const name: NoteTypes.NoteDocumentName = document.name
  if (typeof title !== 'undefined') name.title = title
  if (typeof tags !== 'undefined') {
    const tagsSet = new Set([...name.tags, ...tags])
    name.tags = Array.from(tagsSet)
  }

  // DType
  const isOldDataStructure =
    typeof name.isOnS3 !== 'undefined' ||
    typeof name.isGzip !== 'undefined' ||
    typeof name.isBinary !== 'undefined' ||
    typeof name.isEncrypt !== 'undefined' ||
    typeof name.edit_mode !== 'undefined'

  const dType = isOldDataStructure ? new DType() : new DType(document.type)

  if (isOldDataStructure) {
    if (typeof name.isOnS3 !== 'undefined') {
      dType.isOnServer = !name.isOnS3
      delete name.isOnS3
    }
    if (typeof name.isGzip !== 'undefined') {
      dType.isGzip = name.isGzip
      delete name.isGzip
    }
    if (typeof name.isBinary !== 'undefined') {
      dType.isBinary = name.isBinary
      delete name.isBinary
    }
    if (typeof name.isEncrypt !== 'undefined') {
      dType.isEncrypted = name.isEncrypt
      delete name.isEncrypt
    }

    if (typeof name.edit_mode !== 'undefined') {
      dType.isEditable = !!name.edit_mode
      delete name.edit_mode
    }

    dType.setMediaType(name.type)
  }

  let note: NoteTypes.Note
  // Update document
  if (typeof content === 'undefined') {
    // Does not need to update content
    params.name = name
    const response = await store.level2SDK.documentServices
      .updateDocument({ ...params, type: dType.value })
      .then(store.responseCatcher)
      .catch(store.errorCatcher)
    if (!response || response.code !== 0) {
      throw new AiTmedError({
        name: 'UNKNOW_ERROR',
        message: 'Note -> update -> updateDocument -> no response',
      })
    }
    note = await retrieveNote(document.id, edge)
  } else {
    // Need to update content

    // Content to Blob
    const blob = await contentToBlob(content, mediaType)

    // Gzip
    const { data: gzipData, isGzip } = await produceGzipData(blob)
    dType.isGzip = isGzip
    dType.isOnServer = gzipData.length < CONTENT_SIZE_LIMIT

    // Encryption
    const { data, isEncrypt } = await produceEncryptData(gzipData, edge.besak)
    dType.isEncrypted = isEncrypt

    const bs64Data = await store.level2SDK.utilServices.uint8ArrayToBase64(data)
    dType.isBinary = false

    name.type = blob.type
    params.size = blob.size

    if (dType.isOnServer) {
      name.data = bs64Data
    } else {
      if (typeof name.data !== 'undefined') delete name.data
    }

    params.name = name

    // Create new DOC
    const response = await store.level2SDK.documentServices.createDocument({
      eid: edge.eid,
      type: dType.value,
      name,
      size: blob.size,
    })

    if (!response || response.code !== 0) {
      throw new AiTmedError({
        name: 'UNKNOW_ERROR',
        message: 'Note -> update -> updateDocument -> no response',
      })
    }

    const { id, deat }: CommonTypes.Doc = response.data
    if (deat !== null && deat && deat.url && deat.sig) {
      await store.level2SDK.documentServices
        .uploadDocumentToS3({ url: deat.url, sig: deat.sig, data: bs64Data })
        .then(store.responseCatcher)
        .catch(store.errorCatcher)
    }

    // Delete old DOC
    await store.level2SDK.documentServices
      .deleteDocument([document.id])
      .then(store.responseCatcher)
      .catch(store.errorCatcher)

    note = await retrieveNote(id, edge)
  }

  // return new note
  return note
}

const listDocsFilter = (
  document: CommonTypes.Doc,
  { dataType, mediaType, ...options }: NoteUtilsTypes.ListDocsOptions
) => {
  const dType = new DType(document.type)
  if (dataType !== undefined) {
    if (typeof dataType === 'number' && dataType !== dType.dataType) {
      return false
    } else if (typeof dataType !== 'number') {
      if (dataType === 'profile') {
        const name: NoteTypes.NoteDocumentName = document.name
        if (name.title !== 'profile' || name.type !== 'application/json') {
          return false
        }
      } else {
        if (dataType !== dType.getDataType()) return false
      }
    }
  }
  if (mediaType !== undefined) {
    if (typeof mediaType === 'number' && mediaType !== dType.mediaType) {
      return false
    } else if (
      typeof mediaType !== 'number' &&
      mediaType !== dType.getMediaType()
    ) {
      return false
    }
  }

  for (const key in options) {
    const value = options[key]
    const dTypeValue = dType[key]
    if (value !== undefined && dTypeValue !== undefined) {
      if (value !== dTypeValue) return false
    }
  }
  return true
}
/**
 *
 * @param edge: Edge
 * @param options: NoteUtilsTypes.ListDocsOptions
 * @param options.shared?: Boolean
 * @param options.count?: number
 * @param options.sort_by?: 0 | 1 | 2
 *
 * @param options.isOnServer?: boolean
 * @param options.isGzip?: boolean
 * @param options.isBinary?: boolean
 * @param options.isEncrypted?: boolean
 * @param options.hasExtraKey?: boolean
 * @param options.isEditable?: boolean
 *
 * @param options.dataType?: number
 * @param options.mediaType?: number
 *
 * @returns Promise<Doc[]>
 */
export const listDocs: NoteUtilsTypes.ListDocs = async (edge, options = {}) => {
  const { shared = false, count = 10, sort_by = 0, ...otherOptions } = options
  let idOfRootNotebook
  if (shared) {
    idOfRootNotebook = edge.refid
  } else {
    idOfRootNotebook = edge.eid
  }
  const response = await store.level2SDK.documentServices
    .retrieveDocument({
      idList: [idOfRootNotebook],
      options: { xfname: 'eid' },
    })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)

  if (!response || !response.data || !Array.isArray(response.data)) {
    throw new AiTmedError({
      name: 'UNKNOW_ERROR',
      message: 'Note -> list -> retrieveDocument -> no response',
    })
  }

  const documents = (response.data as CommonTypes.Doc[]).filter((document) =>
    listDocsFilter(document, otherOptions)
  )

  return documents
}
