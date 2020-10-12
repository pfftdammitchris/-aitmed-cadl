import AiTmedError from '../../common/AiTmedError'
import { retrieveEdge } from '../../common/retrieve'
import store from '../../common/store'
import { ungzip } from '../../utils'

import DType from '../../common/DType'

import * as NoteTypes from '../Note/types'
import * as NoteUtilsTypes from './utilsTypes'

export const CONTENT_SIZE_LIMIT = 32768
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
    ...document,
    name: {
      title: name.title,
      type: contentType,
      data: content,
      tags: name.tags || [],
    },

    created_at: document.ctime * 1000,
    modified_at: document.mtime * 1000,
    type: {
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
