import initSqlJs from 'sql.js'
import docTableDao from './Dao/DocTableDao'
import indexTablesDao from './Dao/IndexTablesDao'

export default class FrontEndDB {
  public databaseName = 'AiTMeet.db'
  public IndexTablesDao
  public DocTableDao
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
        'CREATE TABLE index_tables (id int, fkey int, fuzzyKey char, initMapping char, kText char, docId char, docType int, score int);'

      frontEndDB.INSTANCE.run(createEcosDocTable)
      frontEndDB.INSTANCE.run(createIndexTable)

      this.DocTableDao = docTableDao(frontEndDB.INSTANCE)
      this.IndexTablesDao = indexTablesDao(frontEndDB.INSTANCE)
      this.#state.initialized = true
    }
    //Initialize database
    return frontEndDB.INSTANCE
  }

  get initialized() {
    return this.#state.initialized
  }
}
