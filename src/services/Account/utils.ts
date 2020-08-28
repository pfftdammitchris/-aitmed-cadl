import { CommonTypes } from '../../common/types'

import store from '../../common/store'
import AiTmedError from '../../common/AiTmedError'
import { eTypes } from '../../common/eTypes'

import Note from '../Note'
import Notebook, { listEdges } from '../Notebook'

import * as AccountTypes from './types'
import * as AccountUtilsTypes from './utlsTypes'

export const decodeUID: AccountUtilsTypes.DecodeUID = (uid) => {
  const lastIOfPlus = uid.lastIndexOf('+')
  if (lastIOfPlus < 0) {
    throw new AiTmedError({ name: 'UID_INVALID' })
  }
  return {
    userId: uid.slice(0, lastIOfPlus),
    phone_number: uid.slice(lastIOfPlus),
  }
}

export const generateUser: AccountUtilsTypes.GenerateUser = async (
  edge,
  profile
) => {
  const id = store.utils.idToBase64(edge.bvid)
  const response = await store.level2SDK.vertexServices
    .retrieveVertex({
      idList: [id],
    })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)

  if (!response || response.code !== 0) {
    throw new AiTmedError({
      name: 'UNKNOW_ERROR',
      message: 'Account -> utils -> generateUser -> no response',
    })
  }

  const vertex = response.data[0] as CommonTypes.Vertex
  const name =
    vertex.name !== null && vertex.name !== undefined
      ? (vertex.name as AccountTypes.VertexName)
      : { name: '' }

  const { userId, phone_number } = decodeUID(vertex.uid)

  return {
    id,
    name: name.name,
    userId,
    phone_number,
    profile: profile || null,
  }
}

export const createRootEdge: AccountUtilsTypes.CreateRootEdge = async () => {
  const notebook = await Notebook.create({
    title: 'root',
    isEncrypt: true,
    type: eTypes.ROOT,
  })
  return notebook
}

export const retrieveRootEdge: AccountUtilsTypes.RetrieveRootEdge = async () => {
  const edges = await listEdges({ type: eTypes.ROOT })
  if (edges.length <= 0) {
    throw new AiTmedError({ name: 'ROOT_NOTEBOOK_NOT_EXIST' })
  }
  return edges[0]
}

export const createProfile: AccountUtilsTypes.CreateProfile = async (
  rootId,
  { profile_photo, ..._profile }
) => {
  const profile: AccountTypes.ProfileInDocument = _profile

  // Upload Profile Photo
  if (profile_photo) {
    if (!/^image/.test(profile_photo.type)) {
      throw new AiTmedError({ name: 'PROFILE_PHOTO_INVALID' })
    }
    const profilePhotoNote = await Note.create({
      notebook_id: rootId,
      title: 'profile_photo',
      content: profile_photo,
    })
    profile.profile_photo = profilePhotoNote.id
  }

  // Create Profile
  const note = await Note.create({
    notebook_id: rootId,
    title: 'profile',
    content: profile,
    dataType: 1,
  })

  return note
}

export const removeProfile: AccountUtilsTypes.RemoveProfile = async (
  id,
  note
) => {
  const profile = note.info.content as AccountTypes.ProfileInDocument
  // Remove Profile Photo
  if (profile && profile.profile_photo) {
    await store.level2SDK.documentServices
      .deleteDocument([profile.profile_photo])
      .then(store.responseCatcher)
      .catch(store.errorCatcher)
  }
  // Remove Profile
  await store.level2SDK.documentServices
    .deleteDocument([id])
    .then(store.responseCatcher)
    .catch(store.errorCatcher)
}

export const retrieveProfile: AccountUtilsTypes.RetrieveProfile = async (
  rootId
) => {
  const notes = await Note.list(rootId, { dataType: 'profile' })
  if (notes.ids.length <= 0) return null
  const noteId = notes.ids[0]
  const profileInDoc = notes.mapper[noteId].info
    .content as AccountTypes.ProfileInDocument

  if (!profileInDoc) return null

  const { profile_photo, ...restProfile } = profileInDoc
  const profile: AccountTypes.Profile = { ...restProfile }
  // Retrieve Profile Photo
  if (profile_photo) {
    const profilePhotoNote = await Note.retrieve(profile_photo)
    const content = profilePhotoNote.info.content
    if (content && content instanceof Blob) {
      profile.profile_photo = content
    }
  }
  return { noteId, profile }
}
