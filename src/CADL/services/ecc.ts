import store from '../../common/store'

export default {
  signature(message: string): string {
    const sig = store.level2SDK.utilServices.signature(message)
    return sig
  },
  verifySignature(signature: string, pkSign: string): boolean {
    const isValid = store.level2SDK.utilServices.verifySignature(
      signature,
      pkSign
    )
    return isValid
  },
  decryptAES({ key, message }) {
    const secretKeyUInt8Array = store.level2SDK.utilServices.normalizeStringTo32BitArray(
      key
    )
    const encryptedDataUInt8Array = store.level2SDK.utilServices.base64ToUint8Array(
      message
    )

    const sk = store.level2SDK.utilServices.sKeyDecrypt(
      secretKeyUInt8Array,
      encryptedDataUInt8Array
    )

    let skBase64
    if (sk instanceof Uint8Array) {
      skBase64 = store.level2SDK.utilServices.uint8ArrayToBase64(sk)
    }
    return skBase64
  },
  skCheck({ pk, sk }) {
    let pkUInt8Array = pk
    let skDataUInt8Array = sk

    if (typeof pk === 'string') {
      pkUInt8Array = store.level2SDK.utilServices.base64ToUint8Array(pk)
    }
    if (typeof sk === 'string') {
      skDataUInt8Array = store.level2SDK.utilServices.base64ToUint8Array(sk)
    }

    const isValid = store.level2SDK.utilServices.aKeyCheck(
      pkUInt8Array,
      skDataUInt8Array
    )

    return isValid
  },
}
