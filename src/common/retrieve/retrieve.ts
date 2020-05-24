import store from '../store'
import { Vertex, Doc, Edge } from '../../types/lvl2SDK'

const retrieveVertex = async (
  id: Uint8Array | string,
): Promise<Vertex | null> => {
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

const retrieveEdge = async (id: string | Uint8Array): Promise<Edge | null> => {
  const response = await store.level2SDK.edgeServices
    .retrieveEdge({
      idList: [id],
    })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)
  return response && Array.isArray(response.data) && response.data.length > 0
    ? response.data[0]
    : null
}

const retrieveDocument = async (
  id: string | Uint8Array,
): Promise<Doc | null> => {
  const response = await store.level2SDK.documentServices
    .retrieveDocument({ idList: [id] })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)

  return response && Array.isArray(response.data) && response.data.length > 0
    ? response.data[0]
    : null
}

export { retrieveVertex, retrieveEdge, retrieveDocument }
