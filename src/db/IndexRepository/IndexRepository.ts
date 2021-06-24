import FrontEndDB from '../FrontEndDB'
export default class IndexRepository {
  public docTableDao
  public indexTablesDao
  public userDB

  constructor() {
    this.userDB = new FrontEndDB()
  }

  public async getDataBase(config) {
    await this.userDB.getDatabase(config)
    this.docTableDao = this.userDB.DocTableDao
    this.indexTablesDao = this.userDB.IndexTablesDao
  }

  public indexTableIsEmpty() {
    return this.indexTablesDao.getCount() === 0
  }

  public insertIndexData(personalIndexTables) {
    this.indexTablesDao.insertAll(personalIndexTables)
  }

  public getTypeById(did) {
    return this.indexTablesDao.getTypeById(did)
  }

  public deleteIndexByDocId(did) {
    this.indexTablesDao.deleteIndexByDocId(did)
  }

  public getPIByDocId(did) {
    return this.indexTablesDao.getPIByDocId(did)
  }

  public getkTextByDid(docId) {
    return this.indexTablesDao.getAllkTextByDid(docId)
  }

  public getAllDocId() {
    return this.indexTablesDao.getAllDocId()
  }

  public getAllDocByFkey({ kInput, ins_hex }) {
    return this.indexTablesDao.extendAndFuzzySearch({ kInput, ins_hex })
  }

  public getDocById(did) {
    return this.docTableDao.getDocById(did)
  }

  public cacheDoc(doc) {
    this.docTableDao.insertDoc(doc)
  }

  public deleteCachedDocById(did) {
    return this.docTableDao.deleteDocById(did)
  }

  public getDocsByIds(relatedDocsIds) {
    let result = []
    for (let did of relatedDocsIds) {
      result.push(this.docTableDao.getDocById(did))
    }
    return result
  }

  public getDocsByPageId(pageId) {
    return this.docTableDao.getDocsByPageId(pageId)
  }
}
