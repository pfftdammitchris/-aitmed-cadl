import FrontEndDB from './FrontEndDB'

describe('FrontEndDB tests', () => {
  it('should initialize db', async () => {
    const frontEndDb = new FrontEndDB()
    var config = {
      locateFile: (filename) => {
        debugger
        return `./node_modules/sql.js/dist/${filename}`
      },
    }
    const db = await frontEndDb.getDatabase(config)
    console.log(db)
    expect(db).toBeInstanceOf('Database')
  })
})
