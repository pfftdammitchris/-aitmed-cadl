import { CommonTypes } from '../../common/types'
import { eTypes, codeList } from '../../common/eTypes'
import store from '../../common/store'
import { retrieveEdge } from '../../common/retrieve'
import AiTmedError from '../../common/AiTmedError'

import * as NotebookTypes from './types'
import * as NotebookUtilsTypes from './utilsTypes'

/**
 * Convert edge object to notebook object
 * @param edge: Edge
 * @returns NotebookType
 */
export const edgeToNotebook: NotebookUtilsTypes.EdgeToNotebook = (edge) => {
  if (edge.type !== eTypes.NOTEBOOK && edge.type !== eTypes.ROOT) {
    throw new AiTmedError({ name: 'NOT_A_NOTEBOOk' })
  }
  let info
  if (typeof edge.name === 'object') {
    info = edge.name
  } else if (edge.name && typeof edge.name === 'string') {
    try {
      info = JSON.parse(edge.name)
    } catch (error) {
      throw new AiTmedError({
        name: 'UNKNOW_ERROR',
        message: 'Notebook -> edgeToNotebook -> JSON.parse edge.name failed',
      })
    }
  } else {
    info = {}
  }

  const notebook: NotebookTypes.Notebook = {
    id: store.utils.idToBase64(edge.eid),
    owner_id: store.utils.idToBase64(edge.bvid),

    info,
    refid: store.utils.idToBase64(edge.refid),


    created_at: edge.ctime * 1000,
    modified_at: edge.mtime * 1000,

    isEncrypt: edge.besak.length > 0 || edge.eesak.length > 0,
    type: edge.type,
  }
  return notebook
}

/**
 *
 * @param id: Uint8Array | string
 * @returns Promise<NotebookType>
 */
export const retrieveNotebook: NotebookUtilsTypes.RetrieveNotebook = async (
  id,
) => {
  const edge = await retrieveEdge(id)
  if (!edge) throw new AiTmedError({ name: 'NOTEBOOK_NOT_EXIST' })
  return edgeToNotebook(edge)
}

export const listEdges: NotebookUtilsTypes.ListEdges = async (params = {}) => {
  const {
    // @ts-ignore
    shared = false,
    count = 10,
    // @ts-ignore
    edit_mode = 7,
    sort_by = 0,
    type = eTypes.NOTEBOOK,
    xfname = 'bvid',
    isEncrypt,
    loid = '',
    obfname = 'mtime',
    scondition,
  } = params
  if (!codeList.includes(type)) {
    throw new AiTmedError({ name: 'NOTEBOOK_TYPE_INVALID' })
  }
  const condition: string[] = []
  if(typeof scondition !== 'undefined'){
    condition.push(scondition)
  }
  if (isEncrypt === true) condition.push('besak is not null')
  else if (isEncrypt === false) condition.push('besak is null')

  const response = await store.level2SDK.edgeServices
    .retrieveEdge({
      idList: [],
      options: {
        xfname,
        type,
        asc: !!sort_by,
        scondition: condition.join(' and '),
        maxcount: count,
        loid,
        obfname,
      },
    })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)
  if (!response || !response.data || !Array.isArray(response.data)) {
    throw new AiTmedError({
      name: 'UNKNOW_ERROR',
      message: 'Notebook -> utils -> listEdges -> no response',
    })
  }

  const edges: CommonTypes.Edge[] = response.data
  return edges
}

export const edgeToInvite = (edge) => {
  if (edge.type !== eTypes.INVITE) {
    throw new AiTmedError({ name: 'NOT_AN_INVITE' })
  }
  let info
  if (typeof edge.name === 'object') {
    info = edge.name
  } else if (edge.name && typeof edge.name === 'string') {
    try {
      info = JSON.parse(edge.name)
    } catch (error) {
      throw new AiTmedError({
        name: 'UNKNOW_ERROR',
        message: 'Notebook -> edgeToInvite -> JSON.parse edge.name failed',
      })
    }
  } else {
    info = {}
  }
  const invite: NotebookTypes.Invite = {
    id: store.utils.idToBase64(edge.eid),
    owner_id: store.utils.idToBase64(edge.bvid),

    info: {
      notebook: {
        title: info.eventName,
      },
      invitee: {
        name: info.inviteeName,
        phoneNumber: info.inviteePhoneNumber
      },
      inviter: {
        name: info.inviterName
      }
    },

    notebookId: store.utils.idToBase64(edge.refid),
    directedTo: store.utils.idToBase64(edge.evid),

    created_at: edge.ctime * 1000,
    modified_at: edge.mtime * 1000,

    type: edge.type,
  }
  return invite
}
export const edgeToAcceptedInvite = (edge) => {
  if (edge.type !== eTypes.ACCEPT_INVITE) {
    throw new AiTmedError({ name: 'NOT_AN_ACCEPTED_INVITE' })
  }
  let info
  if (edge.name && typeof edge.name === 'object') {
    info = edge.name
  } else if (typeof edge.name === 'string' && edge.name != "") {
    try {
      info = JSON.parse(edge.name)
    } catch (error) {
      throw new AiTmedError({
        name: 'UNKNOW_ERROR',
        message: 'Notebook -> edgeToAcceptedInvite -> JSON.parse edge.name failed',
      })
    }
  } else {
    info = {}
  }
  const acceptedInvite: NotebookTypes.AcceptedInvite = {
    id: store.utils.idToBase64(edge.eid),
    owner_id: store.utils.idToBase64(edge.bvid),
    info,
    inviteId: store.utils.idToBase64(edge.refid),
    directedTo: store.utils.idToBase64(edge.evid),

    created_at: edge.ctime * 1000,
    modified_at: edge.mtime * 1000,
    type: edge.type,
  }
  return acceptedInvite
}