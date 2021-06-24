import FrontEndDB from '../../'
describe('IndexTableDao', () => {
  let ind1 = {
    id: 1,
    fkey: 'red',
    fuzzyKey: 'fsdfds',
    initMapping: 'fsdfds',
    kText: 'lloo',
    docId: 'olol',
    docType: 'fdsf',
    score: 9,
  }
  let frontEndDb: FrontEndDB
  let db
  beforeEach(async () => {
    var config = {
      locateFile: (filename) => {
        return `./node_modules/sql.js/dist/${filename}`
      },
    }
    frontEndDb = new FrontEndDB()
    db = await frontEndDb.getDatabase(config)
  })

  describe('getCount', () => {
    it('should get the count of the items in the index_tables', () => {
      const res = frontEndDb.IndexTablesDao.getCount()
      expect(res).toEqual(0)
    })
  })

  describe('insertAll', () => {
    it('should successfully insert an index entry into the index_tables', () => {
      frontEndDb.IndexTablesDao.insertAll(ind1)
      const res2 = frontEndDb.IndexTablesDao.getCount()
      expect(res2).toEqual(1)
    })
  })

  describe('getPIByDocId', () => {
    it('should get the index entry using the docId', () => {
      frontEndDb.IndexTablesDao.insertAll(ind1)
      const res = frontEndDb.IndexTablesDao.getPIByDocId('olol')
      expect(res[0].values[0][5]).toEqual('olol')
    })
  })
  describe('deleteIndexByDocId', () => {
    it('should delete the index entry using the docId', () => {
      frontEndDb.IndexTablesDao.insertAll(ind1)
      const res = frontEndDb.IndexTablesDao.getCount()
      expect(res).toEqual(1)
      frontEndDb.IndexTablesDao.deleteIndexByDocId('olol')
      const res2 = frontEndDb.IndexTablesDao.getCount()
      expect(res2).toEqual(0)
    })
  })
  describe('getAllDocId', () => {
    it('should get all docIds of the index entries', () => {
      frontEndDb.IndexTablesDao.insertAll(ind1)
      const res = frontEndDb.IndexTablesDao.getCount()
      expect(res).toEqual(1)
      const res2 = frontEndDb.IndexTablesDao.getAllDocId()
      expect(res2[0].values[0][0]).toEqual('olol')
    })
  })

  describe('getAllkTextByDid', () => {
    it('should get all kTexts of the index entries', () => {
      frontEndDb.IndexTablesDao.insertAll(ind1)
      const res = frontEndDb.IndexTablesDao.getCount()
      expect(res).toEqual(1)
      const res2 = frontEndDb.IndexTablesDao.getAllkTextByDid(ind1.docId)
      expect(res2[0].values[0][0]).toEqual('lloo')
    })
  })
  describe('getAllScoreByDid', () => {
    it('should get all scores of the index entries', () => {
      frontEndDb.IndexTablesDao.insertAll(ind1)
      const res = frontEndDb.IndexTablesDao.getCount()
      expect(res).toEqual(1)
      const res2 = frontEndDb.IndexTablesDao.getAllScoreByDid(ind1.docId)
      expect(res2[0].values[0][0]).toEqual(9)
    })
  })
  describe('getTypeById', () => {
    it('should get the docType of the doc with given id', () => {
      frontEndDb.IndexTablesDao.insertAll(ind1)
      const res = frontEndDb.IndexTablesDao.getCount()
      expect(res).toEqual(1)
      const res2 = frontEndDb.IndexTablesDao.getTypeById(ind1.docId)
      expect(res2[0].values[0][0]).toEqual('fdsf')
    })
  })

  xdescribe('extendAndFuzzySearch', () => {
    it('should get the docType of the doc with given id', () => {
      frontEndDb.IndexTablesDao.insertAll(ind1)
      const res = frontEndDb.IndexTablesDao.getCount()
      expect(res).toEqual(1)
      const res2 = frontEndDb.IndexTablesDao.extendAndFuzzySearch({
        kInput: 'lo',
        ins_hex: 'lo',
      })
      expect(res2[0].values[0][0]).toEqual('fdsf')
    })
  })
})
