import FrontEndDB from '../FrontEndDB'
import FuzzyIndexCreator from '../utils/FuzzyIndexCreator'

export default class IndexRepository {
  public docTableDao
  public indexTablesDao
  public userDB

  constructor() {
    this.userDB = new FrontEndDB()
  }

  public search(input: string) {
    if (!input) return
    const fuzzyCreator = new FuzzyIndexCreator()
    const initMapping = fuzzyCreator.initialMapping(input)
    const fuzzyInd = fuzzyCreator.toFuzzyHex(initMapping)
    const res = this.indexTablesDao.extendAndFuzzySearch({
      kInput: input,
      ins_hex: fuzzyInd,
    })
    let docs: any[] = []
    if (!res.length) return docs

    const { values } = res[0]
    const flattenValues = values.reduce((acc, id) => {
      if (!acc.includes(id[0])) {
        acc.push(id[0])
      }
      return acc
    }, [])
    docs = this.getDocsByIds(flattenValues)

    let returnDocs: any[] = []
    for (let doc of docs) {
      if (doc.length) {
        const obj: any = {}
        const { columns, values } = doc[0]
        for (let i = 0; i < columns.length; i++) {
          let prop = columns[i]
          let val = values[0][i]
          if (['deat', 'name'].includes(prop)) {
            obj[prop] = JSON.parse(val)
          } else {
            obj[prop] = val
          }
        }
        returnDocs.push(obj)
      }
    }

    return returnDocs
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
