import FrontEndDB from '../FrontEndDB'
export default class IndexRepository {
  public docTableDao
  public userDB

  constructor(config) {
    this.userDB = new FrontEndDB().getDatabase(config)
    this.docTableDao = this.userDB.DocTableDao
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
