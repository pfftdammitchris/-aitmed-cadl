import store from '../../common/store'
import AiTmedError from '../../common/AiTmedError'
import { sha256 } from 'hash.js'
import { retrieveEdge } from '../../common/retrieve'

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
  encryptAES({ key, message }) {
    const secretKeyUInt8Array = store.level2SDK.utilServices.normalizeStringTo32BitArray(
      key
    )
    const encryptedDataUInt8Array = store.level2SDK.utilServices.base64ToUint8Array(
      message
    )

    const sk = store.level2SDK.utilServices.sKeyEncrypt(
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
    let isValid

    if (typeof pk === 'string') {
      try {
        pkUInt8Array = store.level2SDK.utilServices.base64ToUint8Array(pk)
      } catch (error) {
        isValid = false
      }
    }
    if (typeof sk === 'string') {
      try {
        skDataUInt8Array = store.level2SDK.utilServices.base64ToUint8Array(sk)
      } catch (error) {
        isValid = false
      }
    }
    try {
      isValid = store.level2SDK.utilServices.aKeyCheck(
        pkUInt8Array,
        skDataUInt8Array
      )
    } catch (error) {
      isValid = false
    }

    return isValid
  },

  /**
   *
   * @param sk
   *
   * Generates an esak that can be used as the besak or eesak 
   of an edge
   */
  generateESAK({ pk }: { pk: string }): string {
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
    const esakBase64 = store.level2SDK.utilServices.uint8ArrayToBase64(esak)
    return esakBase64
  },

  /**
   *
   * @param {esak, publicKey, data}
   *
   * Decrypts data using assymetric decryption and the esak provided
   */
  decryptData({
    esak,
    publicKey,
    secretKey,
    data,
  }: {
    esak: Uint8Array | string
    publicKey: string
    secretKey: string
    data: Uint8Array
  }): Uint8Array {
    if (publicKey === null) {
      throw new AiTmedError({
        name: 'LOGIN_REQUIRED',
        message:
          'There is no publicKey present in localStorage. Please log In.',
      })
    }
    if (secretKey === null) {
      throw new AiTmedError({
        name: 'LOGIN_REQUIRED',
        message:
          'There is no secretKey present in localStorage. Please log In.',
      })
    }
    let esakUint8Array: Uint8Array
    if (typeof esak === 'string') {
      esakUint8Array = store.level2SDK.utilServices.base64ToUint8Array(esak)
    } else {
      esakUint8Array = esak
    }
    const pkToUint8Array = store.level2SDK.utilServices.base64ToUint8Array(
      publicKey
    )
    const skToUint8Array = store.level2SDK.utilServices.base64ToUint8Array(
      secretKey
    )
    const partialKey = store.level2SDK.utilServices.aKeyDecrypt(
      pkToUint8Array,
      skToUint8Array,
      esakUint8Array
    )
    const sak = sha256().update(partialKey).digest()
    const sakUint8Array = new Uint8Array(sak)
    const decryptedDataUint8Array = store.level2SDK.utilServices.sKeyDecrypt(
      sakUint8Array,
      data
    )
    if (decryptedDataUint8Array !== null) {
      return decryptedDataUint8Array
    } else {
      throw new AiTmedError({ name: 'ERROR_DECRYPTING_DATA' })
    }
  },

  /**
   *
   * @param {esak, publicKey, secretKey}
   *
   * Assymetrically decrypts the besak || eesak
   */
  decryptESAK({
    esak,
    publicKey,
    secretKey,
  }: {
    esak: Uint8Array | string
    publicKey: string
    secretKey: string
  }): string {
    if (publicKey === null) {
      throw new AiTmedError({
        name: 'LOGIN_REQUIRED',
        message:
          'There is no publicKey present in localStorage. Please log In.',
      })
    }
    if (secretKey === null) {
      throw new AiTmedError({
        name: 'LOGIN_REQUIRED',
        message:
          'There is no secretKey present in localStorage. Please log In.',
      })
    }
    let esakUint8Array: Uint8Array
    if (typeof esak === 'string') {
      esakUint8Array = store.level2SDK.utilServices.base64ToUint8Array(esak)
    } else {
      esakUint8Array = esak
    }
    const pkToUint8Array = store.level2SDK.utilServices.base64ToUint8Array(
      publicKey
    )
    const skToUint8Array = store.level2SDK.utilServices.base64ToUint8Array(
      secretKey
    )
    const partialKey = store.level2SDK.utilServices.aKeyDecrypt(
      pkToUint8Array,
      skToUint8Array,
      esakUint8Array
    )
    const sak = sha256().update(partialKey).digest()
    const sakUint8Array = new Uint8Array(sak)
    const sakBase64 = store.level2SDK.utilServices.uint8ArrayToBase64(
      sakUint8Array
    )
    return sakBase64
  },
  /**
   *
   * @param {id}
   *
   * Checks whether an edge is encrypted or not.
   */
  async isEdgeEncrypted({ id }: { id: string }): Promise<boolean> {
    const edge = await retrieveEdge(id, '')
    if (!edge) throw new AiTmedError({ name: 'EDGE_DOES_NOT_EXIST' })

    if (edge?.besak || edge?.eesak) return true
    return false
  },

  async getSAKFromEdge({ id }: { id: string }): Promise<string> {
    const edge = await retrieveEdge(id, '')
    if (!edge) throw new AiTmedError({ name: 'EDGE_DOES_NOT_EXIST' })

    //WIP:
    //Should return the sak from the edge associated with the given id.

    return ''
  },
}
