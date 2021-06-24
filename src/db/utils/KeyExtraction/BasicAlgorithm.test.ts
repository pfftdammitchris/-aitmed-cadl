import basicAlgorithm from './BasicAlgorithm'

describe('BasicAlgorithm', () => {
  it('should extract all key words from text', () => {
    const res = basicAlgorithm(' hello THere benny, pollY')
    console.log(res)
    expect(res).toEqual(['hello', 'benny', 'polly'])
  })
})
