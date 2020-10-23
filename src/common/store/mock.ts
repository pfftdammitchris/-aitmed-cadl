import { compareUint8Arrays } from '../../utils'
import { CommonTypes } from '../types'

export const mockEdge: CommonTypes.Edge = {
  atime: 1575338814,
  atimes: 1575338814,
  tage: 1575338814,
  besak: new Uint8Array(),
  bvid: new Uint8Array(),
  ctime: 1575338814,
  deat: null,
  eesak: '',
  eid: new Uint8Array(),
  etime: 0,
  type: 10001,
  evid: '',
  mtime: 1575338814,
  name: {},
  refid: '',
  sig: '',
  stime: 0,
  subtype: 0,
}

export const mockDoc: CommonTypes.Doc = {
  subtype: 0,
  atime: 1575338814,
  atimes: 1,
  bsig: '',
  ctime: 1575338814,
  deat: null,
  eid: new Uint8Array(),
  esig: '',
  fid: '',
  id: new Uint8Array(),
  mtime: 1575338814,
  name: {},
  size: 0,
  tage: 0,
  type: 0,
}

const mockStore = {
  level2SDK: {
    Account: {
      createUser: jest.fn(async () => {}),
      login: jest.fn(async () => {}),
      loginNewDevice: jest.fn(async () => {}),
      requestVerificationCode: jest.fn(async () => {}),
      logoutClean: jest.fn(async () => {}),
      logout: jest.fn(async () => {}),
      getStatus: jest.fn(async () => {
        return { code: 0 }
      }),
      changePasswordWithOldPassword: jest.fn(async () => {}),
    },
    vertexServices: {
      createVertex: jest.fn(async () => {}),
      updateVertex: jest.fn(async () => {
        return { data: { id: 'id', uid: 'uid', name: {} } }
      }),
      retrieveVertex: jest.fn(async () => {
        return { data: [{ id: 'id', uid: 'uid', name: {} }] }
      }),
    },
    edgeServices: {
      createEdge: jest.fn(async () => {
        return {
          data: mockEdge,
        }
      }),
      deleteEdge: jest.fn(async () => {}),
      retrieveEdge: jest.fn(async () => {
        return {
          data: [mockEdge],
        }
      }),
      updateEdge: jest.fn(async () => {
        return {
          data: mockEdge,
        }
      }),
    },
    documentServices: {
      createDocument: jest.fn(async () => {
        return {
          data: mockDoc,
        }
      }),
      deleteDocument: jest.fn(async () => {}),
      retrieveDocument: jest.fn(async () => {
        return {
          data: [mockDoc],
        }
      }),
      updateDocument: jest.fn(async () => {
        return {
          data: mockDoc,
        }
      }),
      uploadDocumentToS3: jest.fn(async () => {}),
      downloadDocumentFromS3: jest.fn(async () => {
        return { data: 'data' }
      }),
    },
    commonServices: {
      encryptData: jest.fn((args) => args),
      decryptData: jest.fn((args) => args),
    },
    utilServices: {
      uint8ArrayToBase64: jest.fn((id) => id),
      base64ToUint8Array: jest.fn((id) => id),
    },
  },
  utils: {
    idToBase64: jest.fn((args) => args),
    idToUint8Array: jest.fn((args) => args),
    compareUint8Arrays: jest.fn(compareUint8Arrays),
  },
}

export default mockStore
