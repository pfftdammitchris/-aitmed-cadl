import moment from 'moment'
import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'
import store from '../../common/store'

/**
 *
 * @param apiObject
 *
 * sets hash of requests based on apiObject data
 * returns cached data if present and within limit
 */
export default function setAPIBuffer(apiObject) {
  try {
    let limit
    if (store.env === 'test') {
      limit = 60
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
      //if request has not been made(hash is undefined)
      //we add the timestamp of the request and the apiObject
      apiDispatchBufferObject[hash] = {
        timestamp: currentTimestamp.toString(),
        request: apiObject,
      }
      //TODO: replace with root
      apiDispatchBufferStringUpdate = JSON.stringify(apiDispatchBufferObject)
      localStorage.setItem('api-dispatch-buffer', apiDispatchBufferStringUpdate)

      pass = true
    } else {
      //if similar request has been made (hash exists)
      //compare recorded timestamp with current timestamp
      const oldTimestamp = moment(apiDispatchBufferObject[hash]?.timestamp)
      const timeDiff = currentTimestamp.diff(oldTimestamp, 'seconds')
      if (timeDiff > limit) {
        apiDispatchBufferObject[hash].timestamp = currentTimestamp.toString()
        apiDispatchBufferObject[hash].request = apiObject
        pass = true
      } else {
        apiDispatchBufferObject[`${hash}FAILED_REPEAT`] = {
          timestamp: currentTimestamp.toString(),
          request: apiObject,
        }
        pass = false
      }
    }
    //remove old values
    for (let [key, val] of Object.entries(apiDispatchBufferObject)) {
      //@ts-ignore
      const timeDiff = currentTimestamp.diff(val?.timestamp, 'seconds')
      if (timeDiff > limit) {
        delete apiDispatchBufferObject[key]
      }
    }

    //TODO: replace with root
    apiDispatchBufferStringUpdate = JSON.stringify(apiDispatchBufferObject)
    localStorage.setItem('api-dispatch-buffer', apiDispatchBufferStringUpdate)

    return { pass, cacheIndex: hash }
  } catch (error) {
    console.log(error)
    return { pass: false, cacheIndex: hash }
  }
}
