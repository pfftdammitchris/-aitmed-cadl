import store from '../../common/store'
import { documentToNote } from '../../services/Document'
import { retrieveDocument } from '../../common/retrieve'
import Document from '../../services/Document'

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
}
