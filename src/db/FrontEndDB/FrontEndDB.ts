import initSqlJs from 'sql.js'
import docTableDao from './Dao/DocTableDao'
import indexTablesDao from './Dao/IndexTablesDao'
import apiHashTableDao from './Dao/ApiHashTableDao'

export default class FrontEndDB {
  public databaseName = 'AiTMeet.db'
  public IndexTablesDao
  public DocTableDao
  public ApiHashTableDao
  #state = {
    initialized: false,
  }

  private INSTANCE: any

  public async getDatabase(config) {
    const frontEndDB = this
    if (!this.#state.initialized) {
      const SQL = await initSqlJs(config)
      frontEndDB.INSTANCE = new SQL.Database()
      let createEcosDocTable =
        'CREATE TABLE ecos_doc_table (ctime int, mtime int, atime int, atimes int, id char, name char,deat char, size int, fid char, eid char, bsig char, esig char, subtype int, type int);'
      let createIndexTable =
        'CREATE TABLE index_tables (id char, fkey int, fuzzyKey char, initMapping char, kText char, docId char, docType int, score int);'
      let createApiHashTable =
        'CREATE TABLE api_hash_table (api_input_hash char, resultId char);'

      frontEndDB.INSTANCE.run(createEcosDocTable)
      frontEndDB.INSTANCE.run(createIndexTable)
      frontEndDB.INSTANCE.run(createApiHashTable)

      this.DocTableDao = docTableDao(frontEndDB.INSTANCE)
      this.IndexTablesDao = indexTablesDao(frontEndDB.INSTANCE)
      this.ApiHashTableDao = apiHashTableDao(frontEndDB.INSTANCE)
      this.#state.initialized = true
    }
    //Initialize database
    return frontEndDB.INSTANCE
  }

  get initialized() {
    return this.#state.initialized
  }
}
