import store from '../../../../common/store'
import { isObject } from '../../../../utils'
export default (
  db
): {
  getDocById: (did: string) => any
  getDocByIds
  insertDoc
  deleteDocById
  getDocsByPageId
} => {
  return { getDocById, getDocByIds, insertDoc, deleteDocById, getDocsByPageId }
  function getDocById(did) {
    let sqlstr = 'SELECT * FROM ecos_doc_table WHERE id = :did LIMIT 1'
    let params = { ':did': did }
    let res = db.exec(sqlstr, params)
    return res
  }
  function getDocByIds(dids) {
    let sqlstr = 'SELECT * FROM ecos_doc_table WHERE id IN('
    let params = {}
    dids.forEach((did, index) => {
      const key = `:did${index}`
      sqlstr += key + (index === dids.length - 1 ? ')' : ',')
      params[key] = did
    })
    let res = db.exec(sqlstr, params)
    return res
  }

  function insertDoc(doc) {
    let sqlstr =
      'INSERT INTO ecos_doc_table VALUES (:ctime, :mtime, :atime, :atimes, :id, :name, :deat, :size, :fid, :eid, :bsig, :esig, :subtype, :type, :tage);'
    let params = {}
    for (let [key, val] of Object.entries(doc)) {
      if (val instanceof Uint8Array) {
        params[`:${key}`] = store.level2SDK.utilServices.uint8ArrayToBase64(val)
      } else if (isObject(val)) {
        params[`:${key}`] = JSON.stringify(val)
      } else {
        params[`:${key}`] = val
      }
    }

    let res = db.exec(sqlstr, params)
    return res
  }

  function deleteDocById(did) {
    let sqlstr = `DELETE FROM ecos_doc_table WHERE id = :did`
    let params = {
      [':did']: did,
    }
    let res = db.exec(sqlstr, params)
    return res
  }

  function getDocsByPageId(pageId) {
    let sqlstr = `SELECT * FROM ecos_doc_table WHERE pageId = ${pageId}`
    let res = db.exec(sqlstr)
    console.log(res)
    return res
  }
}
