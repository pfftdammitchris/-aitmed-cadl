import store from '../../common/store'
import sha256 from 'crypto-js/sha256'

export default {
  getFCMToken({ token }) {
    return token
  },
  getAPPID({ appName }) {
    const appNameUint8Array = store.level2SDK.utilServices.base64ToUint8Array(
      appName
    )
    const appNameSHA256 = sha256(appNameUint8Array)
    const appNameSHA256Slice = appNameSHA256.slice(0, 16)
    const appNameSHA256SliceB64 = store.level2SDK.utilServices.uint8ArrayToBase64(
      appNameSHA256Slice
    )

    return appNameSHA256SliceB64
  },
  getFCMTokenSHA256Half({ token }) {
    const tokenUint8Array = store.level2SDK.utilServices.base64ToUint8Array(
      token
    )
    const tokenSHA256 = sha256(tokenUint8Array)
    const tokenSHA256Slice = tokenSHA256.slice(0, 16)
    const tokenSHA256SliceB64 = store.level2SDK.utilServices.uint8ArrayToBase64(
      tokenSHA256Slice
    )

    return tokenSHA256SliceB64
  },
}
