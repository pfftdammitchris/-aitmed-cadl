import FrontEndDB from '../../'

describe('DocTableDao', () => {
  let doc = {}
  let frontEndDb: FrontEndDB
  let db
  beforeEach(async () => {
    var config = {
      locateFile: (filename) => {
        debugger
        return `./node_modules/sql.js/dist/${filename}`
      },
    }
    frontEndDb = new FrontEndDB()
    db = await frontEndDb.getDatabase(config)
  })
  describe('insert', () => {
    it('should successfully insert a doc into the ecos_doc_table', () => {})
  })
})
