import _, { isObject } from 'lodash'
import store from '../../common/store'
import { isPopulated } from '../utils'
import { documentToNote } from '../../services/document/utils'
import { retrieveDocument } from '../../common/retrieve'

// const node = "http://44.192.21.229:9200"
// let index = "doctors"
// const DEFAULT_ADDRESS = "92805"
// const SIZE = 2
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
    console.dir(blob)
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

  log({ value }) {
    console.log(value)
    return
  },

  //decrypt
  async prepareDoc({ doc }: { doc: Record<string, any> }) {
    let note
    if (isObject(doc.subtype)) {
      note = doc
    } else {
      note = await documentToNote({ document: doc })
    }
    const { name } = note
    if (!name?.data) return doc
    if (typeof name?.data !== 'string') return doc
    if (!isPopulated(name?.data)) return doc

    //checking that the string is not base64 encoded
    if (
      typeof name?.data === 'string' &&
      !name?.data.match(
        /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/g
      )
    )
      return note
    const blob = store.level2SDK.utilServices.base64ToBlob(
      name?.data,
      name?.type
    )
    const blobUrl = URL.createObjectURL(blob)
    name.data = blobUrl
    return note
  },
  //  please dont delete
  async prepareDocToPath(id) {
    let path = '../ava.png'
    if (typeof id == 'string') {
      const doc = await retrieveDocument(id)
      await documentToNote({ document: doc }).then(
        (note) => {
          let blob = store.level2SDK.utilServices.base64ToBlob(
            note?.name?.data,
            note?.name?.type
          )
          path = URL.createObjectURL(blob)
        },
        (error) => {
          if (store.env === 'test') {
            console.log(error)
          }
          path = '../ava.png'
        }
      )
      return path
    }
    return path

  },

  alert({ value }) {
    alert(value)
    return
  },

  getCountryCode(num: string) {
    return num.split(' ')[0]
  },

  getPhoneNumber(num: string) {
    return num.split(' ')[1]
  },
}
