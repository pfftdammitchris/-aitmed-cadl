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
  id: string | Uint8Array
): Promise<CommonTypes.Edge | null> => {
  const response = await store.level2SDK.edgeServices
    .retrieveEdge({
      idList: [id],
    })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)
  return response &&
    response.data.edge &&
    Array.isArray(response.data.edge) &&
    response.data.edge.length > 0
    ? response.data.edge[0]
    : null
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
