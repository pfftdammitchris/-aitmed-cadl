import store from '../../common/store'
import AiTmedError from '../../common/AiTmedError'
import { box } from 'tweetnacl'

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

  generateESAK({ pk }) {
    const secretKey = localStorage.getItem('sk')
    if (pk === null) {
      throw new AiTmedError({
        name: 'ERROR_CREATING_ESAK',
      })
    }
    if (secretKey === null) {
      throw new AiTmedError({
        name: 'LOGIN_REQUIRED',
        message:
          'There is no secretKey present in localStorage. Please log In.',
      })
    }

    let pkToUint8Array
    if (typeof pk === 'string') {
      pkToUint8Array = store.level2SDK.utilServices.base64ToUint8Array(pk)
    } else {
      pkToUint8Array = pk
    }
    const skToUint8Array = store.level2SDK.utilServices.base64ToUint8Array(
      secretKey
    )
    const symmetricKey = store.level2SDK.utilServices.generateSKey()
    const partialKey = symmetricKey.slice(0, 16)

    const esak = store.level2SDK.utilServices.aKeyEncrypt(
      pkToUint8Array,
      skToUint8Array,
      partialKey
    )
    return esak
  },

  decryptEESAK({
    sendPublicKey,
    recvSecretKey,
    eData,
    extraKey,
  }: {
    sendPublicKey: Uint8Array
    recvSecretKey: Uint8Array
    eData: Uint8Array
    extraKey?: Uint8Array
  }): Uint8Array | null {
    const sharedKey = box.before(sendPublicKey, recvSecretKey)
    const nonce = eData.slice(0, box.nonceLength)
    const message = eData.slice(box.nonceLength, eData.length)

    const decrypted = extraKey
      ? box.open(message, nonce, extraKey, sharedKey)
      : box.open.after(message, nonce, sharedKey)

    if (!decrypted) {
      console.log('fail to decrypt!')
      return decrypted
    }
    return decrypted
  },

  decryptBESAK({ sk }) {},
}
