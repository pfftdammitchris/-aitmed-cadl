import store from '../../common/store'
import { retrieveEdge, retrieveDocument } from '../../common/retrieve'
import AiTmedError from '../../common/AiTmedError'

import DType from '../../common/DType'
import { CommonTypes } from '../../common/types'

import * as DocumentTypes from './types'
import { UnableToLocateValue } from '../../CADL/errors'

import {
  documentToNote,
  contentToBlob,
  produceEncryptData,
  produceGzipData,
  CONTENT_SIZE_LIMIT,
} from './utils'
import { isPopulated } from '../../CADL/utils'
import ecc from '../../CADL/services/ecc'

/**
 * @param params
 * @param params.edge_id: string
 * @param params.title: string
 * @param params.content: string | Blob
 * @param params.type: 0 | 1 | 2 | 3 | 10 | 11 | 12
 * @param params.tags?: string[]
 * @param params.dataType?: number
 * @returns Promise<Document>
 */
export const create: DocumentTypes.Create = async ({
  edge_id,
  title,
  tags = [],
  content,
  type,
  user,
  sesk,
  aesk,
  targetRoomName,
  fid,
  mediaType,
  dataType = 0,
  dTypeProps,
  paymentNonce,
  jwt,
  dispatch,
}) => {
  //check if eid has been dereferenced
  if (!isPopulated(edge_id)) {
    throw new UnableToLocateValue(`Missing reference ${edge_id}`)
  }
  const edge = await retrieveEdge(edge_id)
  if (!edge) throw new AiTmedError({ name: 'EDGE_DOES_NOT_EXIST' })
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

  dType.isOnServer =
    !!+dTypeProps?.isOnServer || gzipData.length < CONTENT_SIZE_LIMIT

  // Encryption
  dType.isEncrypted = !!+dTypeProps?.isEncrypted
  let esak: Uint8Array | string = ''
  let publicKeyOfSender: string = ''
  const creatorOfEdge =
    edge.bvid instanceof Uint8Array
      ? store.level2SDK.utilServices.uint8ArrayToBase64(edge.bvid)
      : edge.bvid
  const evidOfEdge =
    edge.evid instanceof Uint8Array
      ? store.level2SDK.utilServices.uint8ArrayToBase64(edge.evid)
      : edge.evid
  const currentUserVid = localStorage.getItem('user_vid')
  const isCurrentUserCreatorOfEdge = creatorOfEdge === currentUserVid
  const isCurrentUserOnEvidOfEdge = creatorOfEdge === evidOfEdge
  const publicKeyOfCurrentUser = localStorage.getItem('pk') || ''
  const isInviteEdge = edge?.type === 40000

  if (isCurrentUserCreatorOfEdge) {
    if (
      edge.besak &&
      (!!+dTypeProps?.isEncrypted || dTypeProps?.isEncrypted === 'undefined')
    ) {
      dType.isEncrypted = true

      esak = edge.besak
      publicKeyOfSender = publicKeyOfCurrentUser
    } else if (!edge.besak && !!+dTypeProps?.isEncrypted) {
      dType.isEncrypted = true

      let updatedEdge
      publicKeyOfSender = publicKeyOfCurrentUser
      esak = ecc.generateESAK({ pk: publicKeyOfCurrentUser })
      try {
        updatedEdge = await store.level2SDK.edgeServices.updateEdge({
          besak: esak,
          id: edge.eid,
          type: edge.type,
          name: edge.name,
        })
      } catch (error) {
        console.log(error)
        esak = ''
      }
      if (!updatedEdge || !updatedEdge?.data?.edge) {
        esak = ''
      }
    }
  } else if (isInviteEdge && !isCurrentUserCreatorOfEdge) {
    //we have to fetch invite edge to get eesak
    const { data } = await store.level2SDK.edgeServices.retrieveEdge({
      idList: [edge.eid],
      options: {
        type: 1053,
        xfname: 'refid',
      },
    })
    const { edge: invites } = data
    const inviteEdgeArray = invites.filter((invite) => {
      const evidUint8ArrayToBase64 =
        store.level2SDK.utilServices.uint8ArrayToBase64(invite.evid)

      return evidUint8ArrayToBase64 === currentUserVid
    })
    const inviteEdge = inviteEdgeArray.length > 0 ? inviteEdgeArray.shift() : ''

    if (inviteEdge) {
      esak = inviteEdge.eesak
    }
    if (!inviteEdge) {
      esak = ''
    }

    const { data: creatorOfEdgeResponse } =
      await store.level2SDK.vertexServices.retrieveVertex({
        idList: [edge?.bvid],
      })
    const inviterVertex = creatorOfEdgeResponse?.vertex?.[0]
    publicKeyOfSender = inviterVertex?.deat?.pk
  } else if (isCurrentUserOnEvidOfEdge) {
    if (
      edge.eesak &&
      (!!+dTypeProps?.isEncrypted || dTypeProps?.isEncrypted === 'undefined')
    ) {
      dType.isEncrypted = true
      esak = edge.eesak

      const { data: creatorOfEdgeResponse } =
        await store.level2SDK.vertexServices.retrieveVertex({
          idList: [edge?.bvid],
        })
      const creatorOfEdgeVertex = creatorOfEdgeResponse?.vertex?.[0]
      publicKeyOfSender = creatorOfEdgeVertex?.deat?.pk
    }
  }

  let returnDataInUint8Array = gzipData
  if (dType.isEncrypted) {
    const { data } = await produceEncryptData(gzipData, esak, publicKeyOfSender)
    returnDataInUint8Array = data
  }

  const bs64Data = await store.level2SDK.utilServices.uint8ArrayToBase64(
    returnDataInUint8Array
  )
  dType.isBinary = false

  const name: DocumentTypes.NoteDocumentName = {
    title,
    tags,
    type: blob.type,
  }
  if (user) {
    name.user = user
  }
  if (targetRoomName) {
    name.targetRoomName = targetRoomName
  }
  if (sesk) {
    name.sesk = sesk
  }
  if (aesk) {
    name.aesk = aesk
  }

  // data must be base64 in name field
  if (dType.isOnServer) {
    name.data = bs64Data
  }
  if (paymentNonce) {
    name.nonce = paymentNonce
  }
  const response = await store.level2SDK.documentServices
    .createDocument({
      eid: edge.eid,
      type,
      subtype: dType.value,
      name,
      size: blob.size,
      fid,
      jwt,
    })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)
  if (!response || !response.data) {
    throw new AiTmedError({
      name: 'UNKNOW_ERROR',
      message: 'Document -> create -> createDocument -> no response',
    })
  }
  const document: CommonTypes.Doc = response.data?.document
  if (!document) return response
  const { deat } = document

  if (!dType.isOnServer && deat !== null && deat && deat.url && deat.sig) {
    await store.level2SDK.documentServices
      .uploadDocumentToS3({ url: deat.url, sig: deat.sig, data: bs64Data })
      .then(store.responseCatcher)
      .catch(store.errorCatcher)
  }

  //TODO: convert document type to be read like documentToNote
  //type has to be converted in order to use filter
  if (dispatch) {
    await dispatch({ type: 'insert-to-object-table', payload: { doc: document } })
  }
  const note = await documentToNote({ document })
  // createdoc id-obj update
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
 * @returns Promise<Document>
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
 * @returns Promise<Document>
 */
export const update: any = async (
  id,
  { edge_id, title, content, mediaType, tags, type, dTypeProps, jwt }
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
  if (!edge) throw new AiTmedError({ name: 'EDGE_DOES_NOT_EXIST' })

  // Update Params
  const params: any = {
    id: document.id,
    eid: edge.eid,
  }

  // Update name
  const name: DocumentTypes.NoteDocumentName = document.name
  if (typeof title !== 'undefined') name.title = title
  if (typeof tags !== 'undefined' && Array.isArray(name.tags) && Array.isArray(tags)) {
    const tagsSet = new Set([...name.tags, ...tags])
    name.tags = Array.from(tagsSet)
  }
  if (typeof tags !== 'undefined' && (!Array.isArray(name.tags) || !Array.isArray(tags))) {
    name.tags = []
  }

  // DType
  const isOldDataStructure =
    typeof name.isOnS3 !== 'undefined' ||
    typeof name.isGzip !== 'undefined' ||
    typeof name.isBinary !== 'undefined' ||
    typeof name.isEncrypt !== 'undefined' ||
    typeof name.edit_mode !== 'undefined'

  const dType = isOldDataStructure ? new DType() : new DType(document.type)

  let note: any
  let response
  // Update document
  if (typeof content === 'undefined') {
    // Does not need to update content
    params.name = name
    response = await store.level2SDK.documentServices
      .updateDocument({ ...params, subtype: dType.value, jwt })
      .then(store.responseCatcher)
      .catch(store.errorCatcher)
    if (!response || response.code !== 0) {
      throw new AiTmedError({
        name: 'UNKNOW_ERROR',
        message: 'Document -> update -> updateDocument -> no response',
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
    let esak: Uint8Array | string = ''
    let publicKeyOfSender: string = ''
    if (edge.besak && edge.sig) {
      esak = edge.besak
      if (edge.sig instanceof Uint8Array) {
        publicKeyOfSender =
          await store.level2SDK.utilServices.uint8ArrayToBase64(edge.sig)
      } else {
        publicKeyOfSender = edge.sig
      }
    } else if (edge.eesak && edge.sig) {
      esak = edge.eesak
      if (edge.sig instanceof Uint8Array) {
        publicKeyOfSender =
          await store.level2SDK.utilServices.uint8ArrayToBase64(edge.sig)
      } else {
        publicKeyOfSender = edge.sig
      }
    } else if (!!+dTypeProps?.isEncrypted && !edge.besak) {
      //the document has an isEncrypted prop set to true
      //so we add a besak to edge
      const pk = localStorage.getItem('pk')
      if (pk) {
        let updatedEdge
        publicKeyOfSender = pk
        esak = ecc.generateESAK({ pk })
        try {
          updatedEdge = await store.level2SDK.edgeServices.updateEdge({
            besak: esak,
            id: edge.eid,
            type: edge.type,
            name: edge.name,
            sig: pk,
          })
        } catch (error) {
          console.log(error)
          esak = ''
        }
        if (!updatedEdge || !updatedEdge?.data?.edge) {
          esak = ''
        }
      }
    }

    // Encryption
    const { data, isEncrypt } = await produceEncryptData(
      gzipData,
      esak,
      publicKeyOfSender
    )
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
      jwt,
    })
    if (!response || response.code !== 0) {
      throw new AiTmedError({
        name: 'UNKNOW_ERROR',
        message: 'Document -> update -> updateDocument -> no response',
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
  // update obj
  // return new note
  return {
    jwt: response?.data?.jwt,
    error: response?.data?.error,
    doc: note,
    code: response?.data?.code,
  }
}
