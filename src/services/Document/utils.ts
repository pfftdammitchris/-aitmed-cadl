import AiTmedError from '../../common/AiTmedError'
import { retrieveAuthorizationEdge } from '../../common/retrieve'
import store from '../../common/store'
import { gzip, ungzip } from '../../utils'

import DType from '../../common/DType'

import * as DocumentTypes from './types'
import * as DocumentUtilsTypes from './utilsTypes'

export const CONTENT_SIZE_LIMIT = 32768

/**
 *
 * @param data: Uint8Array | Blob
 * @param besak?: string | Uint8Array
 * @returns Promise<obj>
 * @returns obj.data: Uint8Array
 * @returns obj.isEncrypt: boolean
 */
export const produceEncryptData: DocumentUtilsTypes.ProduceEncryptData = async (
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
    } catch (error) { }
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
export const produceGzipData: DocumentUtilsTypes.ProduceGzipData = async (
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
 * @param content: string | Blob
 * @param type: text/plain | application/json | text/html | text/markdown | image/* | application/pdf | video/* | string
 * @returns Blob
 */
export const contentToBlob: DocumentUtilsTypes.ContentToBlob = (
  content,
  type
) => {
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
 * @param document: Doc
 * @param edge?: Edge
 * @returns Promise<Document>
 */
export const documentToNote: DocumentUtilsTypes.DocumentToNote = async ({
  document,
  _edge,
  esakOfCurrentUser,
}) => {
  // Validate Edge
  const edge =
    typeof _edge === 'undefined'
      ? await retrieveAuthorizationEdge(document)
      : _edge
  if (edge === null)
    throw new AiTmedError({
      name: 'UNKNOW_ERROR',
      message: 'Document -> documentToNote -> retrieveEdge -> edge is null',
    })

  const name: DocumentTypes.NoteDocumentName = document.name
  const contentType = parseInt(name.type) === 0 ? 'text/plain' : name.type
  const deat: DocumentTypes.NoteDocumentDeat | null = document.deat

  // DType
  const isOldDataStructure =
    typeof name.isOnS3 !== 'undefined' ||
    typeof name.isGzip !== 'undefined' ||
    typeof name.isBinary !== 'undefined' ||
    typeof name.isEncrypt !== 'undefined' ||
    typeof name.edit_mode !== 'undefined'

  const dType = isOldDataStructure ? new DType() : new DType(document.subtype)

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
    //@ts-ignore
    isBroken = false,
    //@ts-ignore
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

    const vid = localStorage.getItem('user_vid')
    // Decryption
    const edgeHasBesak = edge.besak && edge.besak !== ''
    const edgeHasEesak = edge.eesak && edge.eesak !== ''
    let inviteEdge
    if (edge.type > 9999) {
      const vidUint8ArrayToBase64 = store.level2SDK.utilServices.uint8ArrayToBase64(
        edge.bvid
      )
      if (vidUint8ArrayToBase64 !== vid) {
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
          const evidUint8ArrayToBase64 = store.level2SDK.utilServices.uint8ArrayToBase64(
            invite.evid
          )

          return evidUint8ArrayToBase64 === vid
        })
        inviteEdge = inviteEdgeArray.length > 0 ? inviteEdgeArray.shift() : ''
      }
    }

    if (
      dType.isEncrypted &&
      (edgeHasBesak || edgeHasEesak || inviteEdge.eesak)
    ) {
      let esak
      const creatorOfEdge =
        edge.bvid instanceof Uint8Array
          ? store.level2SDK.utilServices.uint8ArrayToBase64(edge.evid)
          : edge.evid
      const currentUserVid = localStorage.getItem('user_vid')
      const isCurrentUserCreatorOfEdge =
        creatorOfEdge === currentUserVid
          ? store.level2SDK.utilServices.uint8ArrayToBase64(edge.bvid)
          : edge.bvid
      if (inviteEdge) {
        esak = inviteEdge.eesak
      } else if (esakOfCurrentUser) {
        esak = esakOfCurrentUser
      } else {
        esak = edgeHasBesak ? edge.besak : edge.eesak
      }
      let publicKeyOfSender: string
      if (inviteEdge) {
        const {
          data: inviterVertexResponse,
        } = await store.level2SDK.vertexServices.retrieveVertex({
          idList: [inviteEdge?.bvid],
        })
        const inviterVertex = inviterVertexResponse?.vertex?.[0]
        publicKeyOfSender = store.level2SDK.utilServices.uint8ArrayToBase64(
          inviterVertex?.pk
        )
        try {
          data = await store.level2SDK.commonServices.decryptData(
            esak,
            publicKeyOfSender,
            data
          )
        } catch (error) {
          console.log(error)
        }
      } else if (!isCurrentUserCreatorOfEdge) {
        const {
          data: creatorOfEdgeResponse,
        } = await store.level2SDK.vertexServices.retrieveVertex({
          idList: [edge?.bvid],
        })
        const creatorOfEdgeVertex = creatorOfEdgeResponse?.vertex?.[0]
        publicKeyOfSender = store.level2SDK.utilServices.uint8ArrayToBase64(
          creatorOfEdgeVertex?.pk
        )

        data = await store.level2SDK.commonServices.decryptData(
          esak,
          publicKeyOfSender,
          data
        )
      } else if (edge.type === 10001) {
        const pkLocalStorage = localStorage.getItem('pk')
        publicKeyOfSender = pkLocalStorage ? pkLocalStorage : ''
        data = await store.level2SDK.commonServices.decryptData(
          esak,
          publicKeyOfSender,
          data
        )
      } else if (edge.type === 10000) {
        const pkLocalStorage = localStorage.getItem('pk')
        publicKeyOfSender = pkLocalStorage ? pkLocalStorage : ''
        data = await store.level2SDK.commonServices.decryptData(
          esak,
          publicKeyOfSender,
          data
        )
      } else {
        publicKeyOfSender = localStorage.getItem('pk') || ''

        data = await store.level2SDK.commonServices.decryptData(
          esak,
          publicKeyOfSender,
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
          message: 'Document -> utils -> documentToNote -> JSON.parse failed',
        })
      }
    } else {
      content = blob
    }
  } catch (reason) {
    if (typeof reason === 'string') {
      error = new AiTmedError({
        name: 'DOWNLOAD_FROM_S3_FAIL',
        message: `Document -> documentToNote -> ${reason}`,
      })
    } else {
      error = reason
    }
    content = null
    isBroken = true
  }
  if (content instanceof Blob) {
    content = await store.level2SDK.utilServices.blobToBase64(content)
  }
  return {
    ...document,
    name: {
      title: name.title,
      nonce: name?.nonce,
      targetRoomName: name?.targetRoomName,
      user: name?.user,
      type: contentType === 'text/plain' ? 'application/json' : contentType,
      // data: contentType === 'text/plain' ? { note: content } : content,
      data: content,
      tags: name.tags || [],
    },

    created_at: document.ctime * 1000,
    modified_at: document.mtime * 1000,
    subtype: {
      isOnServer: dType.isOnServer,
      isZipped: dType.isGzip,
      isBinary: dType.isBinary,
      isEncrypted: dType.isEncrypted,
      isEditable: dType.isEditable,
      applicationDataType: dType.dataType,
      mediaType: dType.mediaType,
      size: document.size,
    },
  }
}
