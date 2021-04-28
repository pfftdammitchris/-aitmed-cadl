import initSqlJs from 'sql.js'
import docTableDao from './Dao/DocTableDao'

export default class FrontEndDB {
  public databaseName = 'AiTMeet.db'
  //   public IndexTablesDao
  public DocTableDao
  //   public Api_hash_tablesDao = api_hash_tablesDao()
  #state = {
    initialized: false,
  }

  private INSTANCE: any

  public async getDatabase(config) {
    const frontEndDB = this
    if (!this.#state.initialized) {
      console.log('reded')
      const SQL = await initSqlJs(config)
      frontEndDB.INSTANCE = new SQL.Database()
      let sqlstr = 'CREATE TABLE hello (a int, b char);'
      sqlstr += "INSERT INTO hello VALUES (0, 'hello');"
      sqlstr += "INSERT INTO hello VALUES (1, 'world');"
      const res = frontEndDB.INSTANCE.exec(sqlstr)
      this.DocTableDao = docTableDao(frontEndDB.INSTANCE)
      this.#state.initialized = true
      return res
    }
    //Initialize database
    return frontEndDB.INSTANCE
  }

  get initialized() {
    return this.#state.initialized
  }
}
