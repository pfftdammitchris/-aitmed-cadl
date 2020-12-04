import store from '../../common/store'
import { retrieveEdge, retrieveDocument } from '../../common/retrieve'
import AiTmedError from '../../common/AiTmedError'

import DType from '../../common/DType'
import { CommonTypes } from '../../common/types'

import * as NoteTypes from './types'
import { UnableToLocateValue } from '../../CADL/errors'

import {
  contentToBlob,
  produceEncryptData,
  produceGzipData,
  CONTENT_SIZE_LIMIT,
} from '../Note'
import { documentToNote } from './utils'
import { isPopulated } from '../../CADL/utils'

/**
 * @param params
 * @param params.edge_id: string
 * @param params.title: string
 * @param params.content: string | Blob
 * @param params.type: 0 | 1 | 2 | 3 | 10 | 11 | 12
 * @param params.tags?: string[]
 * @param params.dataType?: number
 * @returns Promise<Note>
 */
export const create: NoteTypes.Create = async ({
  edge_id,
  title,
  tags = [],
  content,
  type,
  mediaType,
  dataType = 0,
  dTypeProps,
}) => {
  debugger
  if (!isPopulated(edge_id)) {
    throw new UnableToLocateValue(`Missing reference ${edge_id}`)
  }
  const edge = await retrieveEdge(edge_id)
  if (!edge) throw new AiTmedError({ name: 'NOTEBOOK_NOT_EXIST' })
  const dType = new DType()
  dType.dataType = dTypeProps?.dataType || dataType
  // Permission
  dType.isEditable = !!+dTypeProps?.isEditable || true

  // Content to Blob
  const blob = await contentToBlob(content, mediaType)
  dType.setMediaType(mediaType || blob.type)

  // Gzip
  const { data: gzipData, isGzip } = await produceGzipData(blob)
  dType.isGzip = !!+dTypeProps?.isGzip || isGzip

  // all documents will be on S3 since we cannot save files in memory
  dType.isOnServer =
    !!+dTypeProps?.isOnServer || gzipData.length < CONTENT_SIZE_LIMIT

  // Encryption
  let esak: Uint8Array | string = ''
  let publicKeyOfReceiver: string = ''
  if (edge.besak && edge.sig) {
    esak = edge.besak
    if (edge.sig instanceof Uint8Array) {
      publicKeyOfReceiver = await store.level2SDK.utilServices.uint8ArrayToBase64(
        edge.sig
      )
    } else {
      publicKeyOfReceiver = edge.sig
    }
  } else if (edge.eesak && edge.sig) {
    esak = edge.eesak
    if (edge.sig instanceof Uint8Array) {
      publicKeyOfReceiver = await store.level2SDK.utilServices.uint8ArrayToBase64(
        edge.sig
      )
    } else {
      publicKeyOfReceiver = edge.sig
    }
  } else if (!!+dTypeProps?.isEncrypted) {
    //TODO: add condition for when isEncrypted prop is in document create noodl api
  }

  const { data, isEncrypt } = await produceEncryptData(
    gzipData,
    esak,
    publicKeyOfReceiver
  )
  dType.isEncrypted = isEncrypt

  const bs64Data = await store.level2SDK.utilServices.uint8ArrayToBase64(data)
  dType.isBinary = false

  const name: NoteTypes.NoteDocumentName = {
    title,
    tags,
    type: blob.type,
  }

  // data must be base64 in name field
  if (dType.isOnServer) {
    name.data = bs64Data
  }
  const response = await store.level2SDK.documentServices
    .createDocument({
      eid: edge.eid,
      type,
      subtype: dType.value,
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
  const document: CommonTypes.Doc = response.data?.document
  const { deat } = document

  if (!dType.isOnServer && deat !== null && deat && deat.url && deat.sig) {
    await store.level2SDK.documentServices
      .uploadDocumentToS3({ url: deat.url, sig: deat.sig, data: bs64Data })
      .then(store.responseCatcher)
      .catch(store.errorCatcher)
  }

  //TODO: convert document type to be read like documentToNote
  //type has to be converted in order to use filter
  const note = await documentToNote({ document })

  return {
    jwt: response?.data?.jwt,
    error: response?.data?.error,
    doc: note,
    code: response?.data?.code,
  }
}

/**
 *
 * @param id: Uint8Array | string
 * @param _edge?: Edge
 * @returns Promise<Note>
 */
//TODO: refactor to account for retrieving using edge and xfname:eid
export const retrieve = async (id, _edge) => {
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
export const update: any = async (
  id,
  { edge_id, title, content, mediaType, tags, type, dTypeProps }
) => {
  // Get original document
  const document = await retrieveDocument(id)
  if (!document) {
    throw new AiTmedError({ name: 'NOT_A_NOTE' })
  }
  // Get edge
  let edge
  if (typeof edge_id !== 'undefined') {
    edge = await retrieveEdge(edge_id)
  } else {
    edge = await retrieveEdge(document.eid)
  }
  if (!edge) throw new AiTmedError({ name: 'NOTEBOOK_NOT_EXIST' })

  // Update Params
  const params: any = {
    id: document.id,
    eid: edge.eid,
  }

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

  let note: any
  let response
  // Update document
  if (typeof content === 'undefined') {
    // Does not need to update content
    params.name = name
    response = await store.level2SDK.documentServices
      .updateDocument({ ...params, subtype: dType.value })
      .then(store.responseCatcher)
      .catch(store.errorCatcher)
    if (!response || response.code !== 0) {
      throw new AiTmedError({
        name: 'UNKNOW_ERROR',
        message: 'Note -> update -> updateDocument -> no response',
      })
    }
    const doc = await retrieveDocument(id)
    note = await documentToNote({ document: doc })
  } else {
    // Need to update content
    // Content to Blob
    const blob = await contentToBlob(content, mediaType)

    // Gzip
    const { data: gzipData, isGzip } = await produceGzipData(blob)
    dType.isGzip = isGzip
    dType.isOnServer =
      !!+dTypeProps?.isOnServer || gzipData.length < CONTENT_SIZE_LIMIT
    // Encryption
    const { data, isEncrypt } = await produceEncryptData(gzipData, edge.besak)
    dType.isEncrypted = isEncrypt

    const bs64Data = await store.level2SDK.utilServices.uint8ArrayToBase64(data)
    dType.isBinary = false

    name.type = blob.type
    params.size = blob.size

    if (dType.isOnServer) {
      name.data = bs64Data
      params.name = name
    } else {
      if (typeof name.data !== 'undefined') delete name.data
    }

    response = await store.level2SDK.documentServices.updateDocument({
      id: document.id,
      eid: edge_id,
      subtype: dType.value,
      name: params.name,
      size: blob.size,
      type,
    })
    if (!response || response.code !== 0) {
      throw new AiTmedError({
        name: 'UNKNOW_ERROR',
        message: 'Note -> update -> updateDocument -> no response',
      })
    }

    const updatedDocument: CommonTypes.Doc = response.data?.document
    const { deat } = updatedDocument
    if (deat !== null && deat && deat.url && deat.sig && !dType.isOnServer) {
      await store.level2SDK.documentServices
        .uploadDocumentToS3({ url: deat.url, sig: deat.sig, data: bs64Data })
        .then(store.responseCatcher)
        .catch(store.errorCatcher)
    }

    const doc = await retrieveDocument(updatedDocument.id)
    note = await documentToNote({ document: doc })
  }

  // return new note
  return {
    jwt: response?.data?.jwt,
    error: response?.data?.error,
    doc: note,
    code: response?.data?.code,
  }
}
