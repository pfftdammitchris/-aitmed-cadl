import FrontEndDB from '../../FrontEndDB'
import ObjectCacheCtr from '../../utils/ObjectCacheCtr'
import store from '../../../common/store'
import sha256 from 'crypto-js/sha256'

describe('ObjectCacheCtr', () => {
  let doc = {
    atime: 1619137372,
    atimes: 1,
    bsig: new Uint8Array([
      236, 47, 28, 214, 219, 91, 67, 56, 51, 118, 176, 50, 203, 232, 217, 107,
    ]),
    ctime: 1619137372,
    deat: null,
    eid: new Uint8Array([
      5, 73, 170, 68, 94, 86, 79, 173, 156, 152, 124, 184, 106, 113, 66, 89,
    ]),
    esig: new Uint8Array([
      116, 223, 65, 231, 201, 253, 75, 37, 167, 16, 34, 102, 157, 213, 210, 48,
    ]),
    fid: '',
    id: store.level2SDK.utilServices.uint8ArrayToBase64(
      new Uint8Array([
        29, 164, 186, 209, 158, 40, 65, 115, 81, 170, 1, 201, 161, 10, 219, 16,
      ])
    ),
    mtime: 1619137372,
    name: {
      data: 'dW5kZWZpbmVk',
      tags: [],
      targetRoomName: 'ewewe',
      title: 'fwf',
      type: 'application/json',
      user: 'fred wesd',
    },
    size: 9,
    subtype: 134217761,
    tage: 0,
    type: 1025,
  }

  let doc2 = {
    atime: 1619132498,
    atimes: 1,
    bsig: new Uint8Array([
      236, 47, 28, 214, 219, 91, 67, 56, 51, 118, 176, 50, 203, 232, 217, 107,
    ]),
    created_at: 1619132498000,
    ctime: 1619132498,
    deat: null,
    eid: new Uint8Array([
      116, 223, 65, 231, 201, 253, 75, 37, 167, 16, 34, 102, 157, 213, 210, 48,
    ]),
    esig: new Uint8Array([
      116, 223, 65, 231, 201, 253, 75, 37, 167, 16, 34, 102, 157, 213, 210, 48,
    ]),
    fid: '',
    id: store.level2SDK.utilServices.uint8ArrayToBase64(
      new Uint8Array([
        137, 233, 149, 162, 86, 51, 79, 174, 70, 117, 236, 109, 213, 32, 243,
        57,
      ])
    ),
    modified_at: 1619132498000,
    mtime: 1619132498,
    name: {
      data: 'dW5kZWZpbmVk',
      tags: [],
      targetRoomName: 'ewewe',
      title: 'gdgdfg',
      type: 'application/json',
      user: 'fred wesd',
    },
    size: 9,
    subtype: 134217761,
    tage: 0,
    type: 1025,
  }
  let frontEndDb: FrontEndDB
  let db
  let objectCacheCtr: ObjectCacheCtr
  beforeEach(async () => {
    var config = {
      locateFile: (filename) => {
        debugger
        return `./node_modules/sql.js/dist/${filename}`
      },
    }
    frontEndDb = new FrontEndDB()
    db = await frontEndDb.getDatabase(config)
    objectCacheCtr = new ObjectCacheCtr()
  })
  describe('retrieveDocFromCache', () => {
    it('should successfully retrieve a doc from the api_hash_table', () => {
      frontEndDb.DocTableDao.insertDoc(doc)
      const apiInputStr = JSON.stringify(doc)
      const apiInputHash = sha256(apiInputStr).toString()
      const res = frontEndDb.ApiHashTableDao.insertApiResult(
        apiInputHash,
        doc.id
      )
      const res2 = objectCacheCtr.retrieveDocFromCache(frontEndDb, apiInputStr)
      console.log(res2)
      expect(res2).toBeTruthy()
    })
  })
})
