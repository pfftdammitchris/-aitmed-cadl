import moment from 'moment'
import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'
import store from '../../common/store'

export default function setAPIBuffer(apiObject) {
  try {
    let limit
    if (store.env === 'test') {
      limit = 1
    } else {
      limit = 3
    }
    const apiDispatchBufferString = localStorage.getItem('api-dispatch-buffer')
    const hash = Base64.stringify(sha256(JSON.stringify(apiObject)))
    const currentTimestamp = moment(Date.now())
    let apiDispatchBufferObject
    if (apiDispatchBufferString !== null) {
      apiDispatchBufferObject = JSON.parse(apiDispatchBufferString)
    } else {
      apiDispatchBufferObject = {}
    }
    let apiDispatchBufferStringUpdate
    let pass
    if (!(hash in apiDispatchBufferObject)) {
      apiDispatchBufferObject[hash] = currentTimestamp.toString()
      apiDispatchBufferStringUpdate = JSON.stringify(apiDispatchBufferObject)
      localStorage.setItem('api-dispatch-buffer', apiDispatchBufferStringUpdate)
      pass = true
    } else {
      const oldTimestamp = moment(apiDispatchBufferObject[hash])
      const timeDiff = currentTimestamp.diff(oldTimestamp, 'seconds')
      if (timeDiff > limit) {
        apiDispatchBufferObject[hash] = currentTimestamp.toString()
        pass = true
      } else {
        apiDispatchBufferObject[
          `${hash}FAILED_REPEAT`
        ] = currentTimestamp.toString()
        pass = false
      }
    }
    //remove old values
    for (let [key, val] of Object.entries(apiDispatchBufferObject)) {
      //@ts-ignore
      const timeDiff = currentTimestamp.diff(val, 'seconds')
      if (timeDiff > limit) {
        delete apiDispatchBufferObject[key]
      }
    }
    apiDispatchBufferStringUpdate = JSON.stringify(apiDispatchBufferObject)
    localStorage.setItem('api-dispatch-buffer', apiDispatchBufferStringUpdate)
    return pass
  } catch (error) {
    console.log(error)
  }
}
