import store from '../../common/store'
import { documentToNote } from '../../services/Document'
import { retrieveDocument } from '../../common/retrieve'
import Document from '../../services/Document'

export default {
  async shareDoc({ sourceDoc, targetEdgeID, targetRoomName, targetFileID }) {
    const document = await retrieveDocument(sourceDoc.id)
    const note = await documentToNote({ document })
    let content = note?.name?.data
    if (typeof content === 'string') {
      content = await store.level2SDK.utilServices.base64ToBlob(
        note?.name?.data,
        note?.name?.type
      )
    }
    const sharedDoc = await Document.create({
      content,
      targetRoomName,
      title: note?.name?.title,
      user: note?.name?.user,
      type: note?.type,
      edge_id: targetEdgeID,
      mediaType: note?.name?.type,
      fid: targetFileID,
    })
    return sharedDoc
  },
  async shareDocByFid({ sourceDoc, targetEdgeID, targetRoomName }) {
    const document = await retrieveDocument(sourceDoc.id)
    const note = await documentToNote({ document })
    let content = note?.name?.data
    if (typeof content === 'string') {
      content = await store.level2SDK.utilServices.base64ToBlob(
        note?.name?.data,
        note?.name?.type
      )
    }
    const sharedDoc = await Document.create({
      content,
      targetRoomName,
      title: note?.name?.title,
      user: note?.name?.user,
      type: note?.type,
      edge_id: note?.eid,
      fid: targetEdgeID,
      mediaType: note?.name?.type,
    })
    return sharedDoc
  },
  async shareDocList({
    sourceDocList,
    targetEdgeID,
    targetRoomName,
    targetFileID,
  }) {
    // let sharedDocList = new array();
    for (let i = 0; i < sourceDocList.length; i++) {
      const document = await retrieveDocument(sourceDocList[i].id)
      const note = await documentToNote({ document })
      let content = note?.name?.data
      if (typeof content === 'string') {
        content = await store.level2SDK.utilServices.base64ToBlob(
          note?.name?.data,
          note?.name?.type
        )
      }
      await Document.create({
        content,
        targetRoomName,
        title: note?.name?.title,
        user: note?.name?.user,
        type: note?.type,
        edge_id: targetEdgeID,
        mediaType: note?.name?.type,
        fid: targetFileID,
      })
      // sharedDocList[i] = sharedDoc
      // return sharedDoc
    }
  },
}
