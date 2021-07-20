import store from '../../common/store'
import { documentToNote } from '../../services/Document'
import { retrieveEdge, retrieveDocument } from '../../common/retrieve'
import Document from '../../services/Document'

/**
 * get 0 or 1 from the specified bit
 * @param sourceNum 
 * @param bit 
 * @returns 
 */
function getBitValue(sourceNum, bit) {
  if (bit <= 8) {
    let value = parseInt(sourceNum).toString(2)
    let len = value.length
    return value[len - bit]
  }
  return
}
/**
 * Set 0 or 1 to the specified bit
 * @param sourceNum => original number
 * @param bit => target bit 
 * @param targetValue => target value for target bit
 * @returns 
 */
function setBitValue(sourceNum, bit, targetValue: 1 | 0) {
  if (bit <= 8) {
    let value = parseInt(sourceNum).toString(2)
    let len = value.length
    let valueArray = value.split('')
    valueArray.splice(len - bit, 1, targetValue.toString())
    let newValue = valueArray.join('')
    return parseInt(newValue, 2)
  }
  return
}

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

  /**
   * Update the type of doc for a given doc array 
   * according to specific rules
   * 
   * specific rules: Set 0|1 to the type specific bit 
   * 
   * @param sourceDocList
   * @param targetBit
   * @param targetValue
   */
  async updateDocListType({ sourceDocList, targetBit, targetValue }) {
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

      const id = await store.level2SDK.utilServices.uint8ArrayToBase64(note?.bsig)
      const edge_id = await store.level2SDK.utilServices.uint8ArrayToBase64(note?.eid)
      const data = await store.level2SDK.edgeServices.createEdge({
        bvid: id,
        type: 1030
      })


      let newType = note?.type
      let bitValue = getBitValue(note?.type, targetBit)
      if (bitValue != targetValue) {
        newType = setBitValue(note?.type, targetBit, targetValue)
      } else {
        continue
      }
      await Document.update(note?.id, {
        edge_id: edge_id,
        content: content,
        type: newType,
        jwt: data?.jwt
      })

      await store.level2SDK.edgeServices.createEdge({
        bvid: localStorage.getItem('user_vid'),
        type: 1030
      })
    }
  },
}
