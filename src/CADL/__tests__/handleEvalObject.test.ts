import CADL from '../CADL'
import { defaultConfig } from '../../config'
import TestPage from '../__mocks__/TestPage'

describe('handleEvalObject', () => {
  const cadl = new CADL({ ...defaultConfig })
  beforeEach(() => {
    cadl.root.TestPage = { ...TestPage }
  })
  describe('should evaluate object commands', () => {
    it('should evaluate assignment', () => {})
  })
})
