import _ from 'lodash'
import store from '../../common/store'

export default {
  base64ToBlob({
    data,
    type = 'application/pdf',
  }: {
    data: string
    type: string
  }) {
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
}
