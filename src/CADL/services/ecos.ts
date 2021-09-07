import store from '../../common/store'
import { documentToNote } from '../../services/Document'
import { retrieveDocument } from '../../common/retrieve'
import Document from '../../services/Document'

/**
 * get 0 or 1 from the specified bit
 * @param sourceNum 
 * @param bit 
 * @returns 
 */
function getBitValue(sourceNum, bit) {
  let value = parseInt(sourceNum).toString(2)
  let len = value.length
  return value[len - bit - 1]
}
/**
 * Set 0 or 1 to the specified bit
 * @param sourceNum => original number
 * @param bit => target bit 
 * @param targetValue => target value for target bit
 * @returns 
 */
function setBitValue(sourceNum, bit, targetValue: 1 | 0) {
  let value = parseInt(sourceNum).toString(2)
  let len = value.length
  let valueArray = value.split('')
  valueArray.splice(len - bit - 1, 1, targetValue.toString())
  let newValue = valueArray.join('')
  return parseInt(newValue, 2)
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
      const data: any = await store.level2SDK.edgeServices.createEdge({
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
        bvid: localStorage.getItem('user_vid')?.toString(),
        type: 1030
      })
    }
  },
  async updateDocListReid({ sourceDocList, reid }) {
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
      const data: any = await store.level2SDK.edgeServices.createEdge({
        bvid: id,
        type: 1030
      })
      await Document.update(note?.id, {
        edge_id: edge_id,
        content: content,
        reid: reid,
        jwt: data?.jwt
      })
      await store.level2SDK.edgeServices.createEdge({
        bvid: localStorage.getItem('user_vid')?.toString(),
        type: 1030
      })
    }
  },

  /**
   * Query each doc id in the sourceDocList as the doc pointed to by the reid,
   *  and update the type for these doc
   * @param sourceDocList 
   * @param targetBit 
   * @param targetValue 
   * @param sCondition 
   */
  async updateReidDocListType({ sourceDocList, targetBit, targetValue, sCondition }) {
    let idList
    for (let i = 0; i < sourceDocList.length; i++) {
      idList = [sourceDocList[i].id]
      let requestOptions = {
        xfname: 'reid',
        scondition: sCondition,
      }
      let reidDocs = await store.level2SDK.documentServices
        .retrieveDocument({
          idList,
          options: requestOptions,
        })
      let reidDocList = reidDocs.data.document
      for (let j = 0; j < reidDocList.length; j++) {
        const document = reidDocList[j]
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
        const data: any = await store.level2SDK.edgeServices.createEdge({
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
          bvid: localStorage.getItem('user_vid')?.toString(),
          type: 1030
        })
      }

    }
  },

  /**
   * Establish a connection between the doc array of the email and the doc of the folder (doc(type=3084))
   * @param sourceDocList 
   * @param folder 
   * @param eid 
   */
  async createFolderTag({ sourceDocList, folder, eid }) {
    let idList
    const type: any = 3840
    const content: any = ""
    const targetRoomName: any = ""
    for (let i = 0; i < sourceDocList.length; i++) {
      //Check if doc(type=3840) exists
      idList = [sourceDocList[i].id, folder]
      const requestOptions = {
        xfname: 'reid,fid',
        type: 3840,
      }
      const linkDocs = await store.level2SDK.documentServices
        .retrieveDocument({
          idList,
          options: requestOptions,
        })
      const folderTags = linkDocs.data.document
      if (folderTags.length == 0) {
        await Document.create({
          content,
          targetRoomName,
          title: "",
          user: "",
          reid: sourceDocList[i].id,
          edge_id: eid,
          fid: folder,
          type: type,
        })
      }
    }
  },

  /**
   * Delete the link between the doc array of the email and the doc of the folder (doc(type=3084))
   * @param sourceDocList 
   * @param folder 
   */
  async deleteFolderTag({ sourceDocList, folder }) {
    let idList
    for (let i = 0; i < sourceDocList.length; i++) {
      idList = [sourceDocList[i].id, folder]
      const requestOptions = {
        xfname: 'reid,fid',
        type: 3840,
      }
      const linkDocs = await store.level2SDK.documentServices
        .retrieveDocument({
          idList,
          options: requestOptions,
        })
      const folderTags = linkDocs.data.document
      for (let j = 0; j < folderTags.length; j++) {
        const document = folderTags[j]
        const note = await documentToNote({ document })
        const res = await store.level2SDK.commonServices.deleteRequest([
          note.id,
        ])
        if (store.env === 'test') {
          console.log(
            '%cDelete Object Response',
            'background: purple; color: white; display: block;',
            res
          )
        }
      }

    }
  }


}
