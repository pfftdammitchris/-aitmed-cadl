import FuzzyIndexCreator from './'

describe('Unit Testing DB Utils', () => {
  describe('FuzzyIndexCreator', () => {
    test('it should create a map of initial string', () => {
      const fuzzyIndexCreator = new FuzzyIndexCreator()
      const initialMapping_Hello = fuzzyIndexCreator.initialMapping('hello')
      const initialMapping_Christina = fuzzyIndexCreator.initialMapping(
        'Christina'
      )
      expect(initialMapping_Hello).toEqual('ala')
      expect(initialMapping_Christina).toEqual('krastana')
    })
  })
})
