import { eTypes, codeList } from '../../common/eTypes'
import store from '../../common/store'
import { retrieveEdge } from '../../common/retrieve'
import AiTmedError from '../../common/AiTmedError'

import { edgeToNotebook, 
  // edgeToInvite, 
  // edgeToAcceptedInvite, 
  retrieveNotebook, listEdges } from './utils'

// import Invite from '../common/invite'

import * as NotebookTypes from './types'

export {
  create,
  remove,
  update,
  retrieve,
  list,
  // listInvites,
  // listAcceptedInvites,
  // listSharedNotebooks,
  // createInvite,
  // acceptInvite,
  // authorizeEvent
}

/**
 * @param params string
 * @param params.title: string
 * @param params.description?: string
 * @param params.isEncrypt: boolean
 *
 * @returns Promise<Notebook>
 */
const create: NotebookTypes.Create = async ({
  title,
  description = '',
  type = eTypes.NOTEBOOK,
  isEncrypt = false,
}) => {
  if (!codeList.includes(type)) {
    throw new AiTmedError({ name: 'NOTEBOOK_TYPE_INVALID' })
  }
  if (type === eTypes.ROOT) {
    const edges = await listEdges({ type: eTypes.ROOT })
    if (edges.length > 0) throw new AiTmedError({ name: 'ROOT_NOTEBOOK_EXIST' })
  }

  const response = await store.level2SDK.edgeServices
    .createEdge({
      type,
      name: { title, description, edit_mode: 7 },
      isEncrypt,
    })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)

  if (!response) {
    throw new AiTmedError({
      name: 'UNKNOW_ERROR',
      message: 'Notebook -> create -> createEdge -> no response',
    })
  }
  return edgeToNotebook(response.data)
}

/**
 * @param id: string
 * @returns Promise<Notebook>
 */
const remove: NotebookTypes.Remove = async (id) => {
  const notebook = await retrieveNotebook(id)
  if (notebook.type === eTypes.ROOT) {
    throw new AiTmedError({ name: 'ROOT_NOTEBOOK_CANNOT_BE_REMOVED' })
  }
  await store.level2SDK.edgeServices
    .deleteEdge([id])
    .then(store.responseCatcher)
    .catch(store.errorCatcher)

  return notebook
}

/**
 * @param id: string
 * @param fields
 * @param fields.title?: string
 * @param fields.description?: string
 * @returns Promise<Notebook>
 */
const update: NotebookTypes.Update = async (id, fields) => {
  const edge = await retrieveEdge(id)
  if (!edge) {
    throw new AiTmedError({ name: 'NOTEBOOK_NOT_EXIST' })
  }
  const response = await store.level2SDK.edgeServices
    .updateEdge({
      id: edge.eid,
      bvid: edge.bvid,
      type: edge.type,
      besak: edge.besak,
      name: { ...edge.name, ...fields },
    })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)

  if (!response || !response.data) {
    throw new AiTmedError({
      name: 'UNKNOW_ERROR',
      message: 'Notebook -> update -> updateEdge -> no response',
    })
  }

  const notebook = await retrieveNotebook(edge.eid)
  return notebook
}

/**
 * @param id: string
 * @returns Promise<Notebook>
 */
const retrieve: NotebookTypes.Retrieve = async (id) => {
  const notebook = await retrieveNotebook(id)
  return notebook
}

/**
 * @param param
 * @param param.shared?: Boolean
 * @param param.count?: number
 * @param param.edit_mode?: number
 * @param param.sort_by?: 0 | 1 | 2
 * @returns response
 * @returns response.ids: string[]
 * @returns response.mapper: Record<string, Notebook>
 */
const list: NotebookTypes.List = async (params = {}) => {
  const edges = await listEdges(params)
  let result
  result = edges.reduce<NotebookTypes.ListReturn>(
    (acc, edge) => {
      const notebook = edgeToNotebook(edge)
      acc.ids.push(notebook.id)
      acc.mapper[notebook.id] = notebook
      return acc
    },
    { ids: [], mapper: {} },
  )
  return result
}
// /**
//  * @param param
//  * @param param.: number
//  * @param param.count?: number
//  * @param param.obfname?: string -field name to order by (e.g ctime, mtime)
//  * @param param.sort_by?: 0 | 1 | 2
//  * @returns response
//  * @returns response.ids: string[]
//  * @returns response.mapper: Record<string, Notebook>
//  * 
//  * -list of notebooks shared with user
//  */
// const listSharedNotebooks: NotebookTypes.ListSharedNotebooks = async (params = {}) => {
//   const edges = await listEdges({ type: 10001, xfname: 'evid', ...params })
//   let result
//   result = edges.reduce<NotebookTypes.ListReturn>(
//     (acc, edge) => {
//       const notebook = edgeToNotebook(edge)
//       acc.ids.push(notebook.id)
//       acc.mapper[notebook.id] = notebook
//       return acc
//     },
//     { ids: [], mapper: {} },
//   )
//   return result
// }

// /**
//  * @param param
//  * @param param.count?: number 
//  * @param param.obfname?: string -field name to order by (e.g ctime, mtime)
//  * @param param.fromMe? boolean -if true xfname = bvid (i.e query all invites created by user) 
//  * @param param.sort_by?:  0 | 1 | 2
//  * @returns response
//  * @returns response.ids: string[]
//  * @returns response.mapper: Record<string, Invite>
//  */
// const listInvites: NotebookTypes.ListInvites = async (params) => {
//   let xfname = 'evid'
//   if (params && params.fromMe) {
//     xfname = 'bvid'
//   }
//   const edges = await listEdges({ type: 1050, xfname, ...params })
//   let result
//   result = edges.reduce<NotebookTypes.ListInvitesReturn>(
//     (acc, edge) => {
//       const invite = edgeToInvite(edge)
//       acc.ids.push(invite.id)
//       acc.mapper[invite.id] = invite
//       return acc
//     },
//     { ids: [], mapper: {} },
//   )
//   return result
// }
// /**
//  * @param param
//  * @param param.count?: number
//  * @param param.obfname?: string -field name to order by (e.g ctime, mtime)
//  * @param param.fromMe? boolean -if true xfname = bvid (i.e query all accedtedInvites created by user) 
//  * @param param.sort_by?:  0 | 1 | 2
//  * @returns response
//  * @returns response.ids: string[]
//  * @returns response.mapper: Record<string, Invite>
//  */
// const listAcceptedInvites: NotebookTypes.ListAcceptedInvites = async (params) => {
//   let xfname = 'evid'
//   if (params && params.fromMe) {
//     xfname = 'bvid'
//   }
//   const edges = await listEdges({ type: 10060, xfname, ...params })
//   let result
//   result = edges.reduce<NotebookTypes.ListAcceptedInvitesReturn>(
//     (acc, edge) => {
//       const acceptedInvite = edgeToAcceptedInvite(edge)
//       acc.ids.push(acceptedInvite.id)
//       acc.mapper[acceptedInvite.id] = acceptedInvite
//       return acc
//     },
//     { ids: [], mapper: {} },
//   )
//   return result
// }

// /**
//  * 
//  * @param params
//  * @param params.info Record<string, any> -notebook/invitation details
//  * @param params.notebookId string | Uint8Array -the id of the notebook being shared
//  * @param params.directedToId string | Uint8Array -the vid of the receiver of the invitation
//  * 
//  * @returns Promise<Notebook>
//  */
// const createInvite: NotebookTypes.CreateInvite = async ({ info, notebookId, directedToId }) => {
//   const invite = await Invite.create({ info, refid: notebookId, directedToId })
//   return invite
// }

// /**
//  * 
//  * @param param
//  * @param params.info Record<string, any> -invitation/notebook details
//  * @param params.inviteId string | Uint8Array -edge id of the invitation being responded to
//  * @param params.directedToId string | Uint8Array -vid of the sender of the invitation(receiver of the acceptance)
//  * 
//  * @returns Promise<Notebook>
//  */
// const acceptInvite: NotebookTypes.AcceptInvite = async ({ info, inviteId, directedToId }) => {
//   const acceptedInvite = await Invite.accept({ info, inviteId, directedToId })

//   return acceptedInvite
// }

// /**
//  * 
//  * @param param
//  * @param params.notebookInfo Record<string, any> -invitation/notebook details
//  * @param params.acceptanceId string | Uint8Array -edge id of the acceptedInvitation edge
//  * @param params.directedToId string | Uint8Array -evid of the receive of the invitation(user that accepted invitation)
//  * 
//  * @returns Promise<Notebook>
//  */
// const authorizeEvent: NotebookTypes.AuthorizeEvent = async ({
//   info,
//   acceptanceId,
//   directedToId
// }) => {
//   const authorizedEdge = await Invite.authorize({ info, acceptanceId, directedToId })

//   return edgeToNotebook(authorizedEdge)
// }

/**
 * Todo:
 * 1. retrieveEdge - check the id is exist or not
 * 2.
 * @param id: string
 * @param invite_phone_number: string
 * @param edit_mode: number
 */
//  export const share = (
//   id: string,
//   invite_phone_number: string,
//   edit_mode: number,
// ): Promise<void> => {
//   console.log('Notebook->share', id, invite_phone_number, edit_mode)
// }

/**
 * Todo:
 * 1. retrieveEdge - check the id is exist or not
 * 2.
 * @param id: string
 * @param invited_phone_number: string
 */
// export const unshare = (
//   id: string,
//   invited_phone_number: string,
// ): Promise<void> => {
//   console.log('Notebook->unshare', id, invited_phone_number)
// }
