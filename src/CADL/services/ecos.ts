import store from '../../common/store'
import { documentToNote } from '../../services/Document'
import { retrieveDocument } from '../../common/retrieve'
import Document from '../../services/Document'
import array from './array'

export default {
  async shareDoc({ sourceDoc, targetEdgeID }) {
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
      title: note?.name?.title,
      type: note?.type,
      edge_id: targetEdgeID,
      mediaType: note?.name?.type,
    })
    return sharedDoc
  },
  async shareDocList({ sourceDocList, targetEdgeID }) {
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
        title: note?.name?.title,
        type: note?.type,
        edge_id: targetEdgeID,
        mediaType: note?.name?.type,
      })
      // sharedDocList[i] = sharedDoc
      // return sharedDoc
    }

  }
}
