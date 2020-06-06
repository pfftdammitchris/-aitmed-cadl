import store from '../../common/store'
import { retrieveEdge, retrieveDocument } from '../../common/retrieve'
import AiTmedError from '../../common/AiTmedError'

import DType from '../../common/DType'
import { CommonTypes } from '../../common/types'

import * as NoteTypes from './types'

import {
    contentToBlob,
    produceEncryptData,
    produceGzipData,
    CONTENT_SIZE_LIMIT,
} from '../Note'
import { documentToNote } from './utils'

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
    dataType = 0,
}) => {
    const edge = await retrieveEdge(edge_id)
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

    const note = await documentToNote({ document })
    return note

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

