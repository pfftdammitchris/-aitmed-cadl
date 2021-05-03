import store from '../store'
import { CommonTypes } from '../../common/types'

const retrieveVertex = async (
  id: Uint8Array | string
): Promise<CommonTypes.Vertex | null> => {
  const response = await store.level2SDK.vertexServices
    .retrieveVertex({
      idList: [id],
    })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)

  return response && Array.isArray(response.data) && response.data.length > 0
    ? response.data[0]
    : null
}

const retrieveEdge = async (
  id: string | Uint8Array,
  docEsig: Uint8Array | string
): Promise<CommonTypes.Edge | null> => {
  let filteredRes
  let response
  if (!docEsig) {
    response = await store.level2SDK.edgeServices
      .retrieveEdge({
        idList: [id],
      })
      .then(store.responseCatcher)
      .catch(store.errorCatcher)
  } else {
    response = await store.level2SDK.edgeServices
      .retrieveEdge({
        idList: [],
        options: {
          xfname: 'bvid | evid',
          maxcount: 200,
        },
      })
      .then(store.responseCatcher)
      .catch(store.errorCatcher)
  }
  if (!docEsig) {
    filteredRes =
      response &&
      response.data.edge &&
      Array.isArray(response.data.edge) &&
      response.data.edge.length > 0
        ? response.data.edge[0]
        : null
  } else if (
    docEsig &&
    response &&
    response.data.edge &&
    Array.isArray(response.data.edge) &&
    response.data.edge.length > 0
  ) {
    filteredRes = response.data.edge.filter(
      (edge) =>
        store.utils.idToBase64(edge.eid) === store.utils.idToBase64(docEsig)
    )[0]
  } else {
    filteredRes = null
  }
  return filteredRes
}

const retrieveDocument = async (
  id: string | Uint8Array
): Promise<CommonTypes.Doc | null> => {
  const response = await store.level2SDK.documentServices
    .retrieveDocument({ idList: [id] })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)
  return response &&
    Array.isArray(response.data.document) &&
    response.data.document.length > 0
    ? response.data.document[0]
    : null
}
export { retrieveVertex, retrieveEdge, retrieveDocument }
