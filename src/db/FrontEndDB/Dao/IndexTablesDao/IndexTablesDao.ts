import store from '../../../../common/store'

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
    insertAll,
  }
  // Austin's suggestion, can both fuzzy search and extened search at the same time
  //select distinct kText from KeyID where (TO_HEX(fKey) like '%ins_hex%')   <- fuzzy search
  // OR (kText like 'kInput%')  <- extened search
  // order by accessTimes desc ;

  function getCount() {
    let sqlstr = 'SELECT COUNT(*) FROM index_tables'
    const res = db.exec(sqlstr)
    return res[0].values[0][0]
  }

  function insertAll(indexTableEntry) {
    let sqlstr =
      // 'INSERT INTO index_tables VALUES (:id, :fKey , :fuzzyKey, :initMapping , :kText , :docId , :docType , :score, :fKeyHex );'
      'INSERT INTO index_tables VALUES (:fKey , :kText , :docId , :docType , :score );'
    let params = {}
    for (let [key, val] of Object.entries(indexTableEntry)) {
      if (val instanceof Uint8Array) {
        params[`:${key}`] = store.level2SDK.utilServices.uint8ArrayToBase64(val)
      } else {
        params[`:${key}`] = val
      }
    }
    let res = db.exec(sqlstr, params)
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
    let sqlstr =
      'SELECT docId FROM index_tables WHERE' +
      //'SELECT' + " docId " + 'FROM index_tables WHERE' +
      " printf('%X', fKey) LIKE '%'|| :ins_hex ||'%'" +
      " OR kText LIKE :kInput || '%'"
    let params = { ':ins_hex': ins_hex, ':kInput': kInput }
    if (docType) {
      sqlstr =
        'SELECT * FROM index_tables WHERE' +
        ' docType = :docType' +
        ' AND (' +
        "printf('%X', fKey) LIKE '%'|| :ins_hex ||'%'" +
        ' OR ' +
        "kText LIKE :kInput || '%'  )"
      params = {
        //@ts-ignore
        ':docType': docType,
        ':ins_hex': ins_hex,
        ':kInput': kInput,
      }
    } else if (docTypeLow && docTypeHigh) {
      sqlstr =
        'SELECT * FROM index_tables WHERE' +
        ' docType BETWEEN :docTypeLow AND :docTypeHigh' +
        ' AND (' +
        "printf('%X', fKey) LIKE '%'|| :ins_hex ||'%'" +
        ' OR ' +
        "kText LIKE :kInput || '%'  )"
      params = {
        //@ts-ignore
        ':docTypeLow': docTypeLow,
        ':docTypeHigh': docTypeHigh,
        ':ins_hex': ins_hex,
        ':kInput': kInput,
      }
    }
    const res = db.exec(sqlstr, params)
    return res
  }

  function getPIByDocId(did) {
    const sqlstr = 'SELECT * FROM index_tables WHERE docId = :did'
    const params = {
      ':did': did,
    }
    const res = db.exec(sqlstr, params)
    return res
  }

  function deleteIndexByDocId(did) {
    const sqlstr = 'DELETE FROM index_tables WHERE docId = :did'
    const params = {
      ':did': did,
    }
    const res = db.exec(sqlstr, params)
    return res
  }

  /*** for update to S3
   */
  function getAllDocId() {
    const sqlstr = 'SELECT DISTINCT docId FROM index_tables'
    const res = db.exec(sqlstr)
    return res
  }

  function getAllkTextByDid(did) {
    const sqlstr =
      'SELECT kText FROM index_tables WHERE docId = :did ORDER BY score'
    const params = {
      ':did': did,
    }
    const res = db.exec(sqlstr, params)
    return res
  }
  function getAllScoreByDid(did) {
    const sqlstr =
      'SELECT score FROM index_tables WHERE docId = :did ORDER By score'
    const params = {
      ':did': did,
    }
    const res = db.exec(sqlstr, params)
    return res
  }

  function getTypeById(did) {
    const sqlstr = 'SELECT docType FROM index_tables WHERE docId = :did'
    const params = {
      ':did': did,
    }
    const res = db.exec(sqlstr, params)
    return res
  }
}
