export default (db) => {
  return { getDocById, getDocByIds, insertDoc, deleteDocById, getDocsByPageId }
  function getDocById(did) {
    let sqlstr = `SELECT * FROM ecos_doc_table WHERE id = ${did} LIMIT 1`
    var res = db.exec(sqlstr)
    console.log(res)
    return res
  }
  function getDocByIds(dids) {
    let sqlstr = `SELECT * FROM ecos_doc_table WHERE id IN(${dids})`
    var res = db.exec(sqlstr)
    console.log(res)
    return res
  }

  function insertDoc() {
    let sqlstr = `SELECT * FROM ecos_doc_table WHERE id = ${did} LIMIT 1`
    var res = db.exec(sqlstr)
    console.log(res)
    return res
  }

  function deleteDocById(did) {
    let sqlstr = `DELETE FROM ecos_doc_table WHERE id = ${did}`
    var res = db.exec(sqlstr)
    console.log(res)
    return res
  }

  function getDocsByPageId(pageId) {
    let sqlstr = `SELECT * FROM ecos_doc_table WHERE pageId = ${pageId}`
    var res = db.exec(sqlstr)
    console.log(res)
    return res
  }
}
