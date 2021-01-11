import _ from 'lodash'
import store from '../../common/store'
import { isPopulated } from '../utils'
import { documentToNote } from '../../services/document/utils'

export default {
  base64ToBlob({
    data,
    type = 'application/pdf',
  }: {
    data: string
    type: string
  }) {
    if (!data) return
    if (typeof data !== 'string') return
    if (!isPopulated(data)) return
    const blob = store.level2SDK.utilServices.base64ToBlob(data, type)
    const blobUrl = URL.createObjectURL(blob)
    return blobUrl
  },
  exists(args: Record<any, any>) {
    for (let val of Object.values(args)) {
      if (val === '' || val === undefined || val === null) {
        return false
      }
    }
    return true
  },

  async prepareDoc({ doc }: { doc: Record<string, any> }) {
    const note = await documentToNote({ document: doc })
    const { name } = note
    if (!name?.data) return
    if (typeof name?.data !== 'string') return
    if (!isPopulated(name?.data)) return
    const blob = store.level2SDK.utilServices.base64ToBlob(
      name?.data,
      name?.type
    )
    const blobUrl = URL.createObjectURL(blob)
    name.data = blobUrl
    return note
  },
}
