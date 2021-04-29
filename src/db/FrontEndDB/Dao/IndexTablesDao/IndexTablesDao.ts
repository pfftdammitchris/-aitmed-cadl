export default (db) => {
  return {
    getCount,
    extendAndFuzzySearch,
    getPIByDocId,
    deleteIndexByDocId,
    getAllDocId,
    getAllkTextByDid,
    getAllScoreByDid,
    getTypeById,
  }
  // Austin's suggestion, can both fuzzy search and extened search at the same time
  //select distinct kText from KeyID where (TO_HEX(fKey) like '%ins_hex%')   <- fuzzy search
  // OR (kText like 'kInput%')  <- extened search
  // order by accessTimes desc ;

  function getCount() {
    let sqlstr = 'SELECT COUNT(*) FROM index_tables'
    var res = db.exec(sqlstr)
    console.log(res)
    return res
  }

  function extendAndFuzzySearch({
    kInput,
    ins_hex,
    docType,
    docTypeLow,
    docTypeHigh,
  }: {
    kInput: string
    ins_hex: string
    docType: number
    docTypeLow: number
    docTypeHigh: number
  }) {
    let sqlstr = `SELECT * FROM index_tables WHERE" +
        " printf('%X', fKey) LIKE '%'|| ${ins_hex} ||'%'" +
        " OR kText LIKE ${kInput} || '%'`
    if (docType) {
      sqlstr = `SELECT * FROM index_tables WHERE" +
" docType = ${docType}" +
" AND (" +
"printf('%X', fKey) LIKE '%'|| ${ins_hex} ||'%'" +
" OR " +
"kText LIKE ${kInput} || '%'  )`
    } else if (docTypeLow && docTypeHigh) {
      sqlstr = `SELECT * FROM index_tables WHERE" +
            " docType BETWEEN ${docTypeLow} AND ${docTypeHigh}" +
            " AND (" +
            "printf('%X', fKey) LIKE '%'|| ${ins_hex} ||'%'" +
            " OR " +
            "kText LIKE ${kInput} || '%'  )`
    }

    var res = db.exec(sqlstr)
    console.log(res)
    return res
  }

  function getPIByDocId(did) {
    let sqlstr = `SELECT * FROM index_tables WHERE docId = ${did}`
    var res = db.exec(sqlstr)
    console.log(res)
    return res
  }

  function deleteIndexByDocId(did) {
    let sqlstr = `DELETE FROM index_tables WHERE docId = ${did}`
    var res = db.exec(sqlstr)
    console.log(res)
    return res
  }
  // @Insert
  // void InsertAll(PersonalIndex... personalIndexTables);

  /*** for update to S3
   */
  function getAllDocId() {
    let sqlstr = 'SELECT DISTINCT docId FROM index_tables'
    var res = db.exec(sqlstr)
    console.log(res)
    return res
  }

  function getAllkTextByDid(did) {
    let sqlstr = `SELECT kText FROM index_tables WHERE docId = ${did} ORDER BY score`
    var res = db.exec(sqlstr)
    console.log(res)
    return res
  }
  function getAllScoreByDid(did) {
    let sqlstr = `SELECT score FROM index_tables WHERE docId = ${did} ORDER By score`
    var res = db.exec(sqlstr)
    console.log(res)
    return res
  }

  function getTypeById(did) {
    let sqlstr = `SELECT docType FROM index_tables WHERE docId = ${did}`
    var res = db.exec(sqlstr)
    console.log(res)
    return res
  }
}
