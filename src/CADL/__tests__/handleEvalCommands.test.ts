import CADL from '../CADL'
import { defaultConfig } from '../../config'
import TestPage from '../__mocks__/TestPage'
jest.mock('../services/edges')
const edgeServices = require('../services/edges')

describe('handleEvalCommands', () => {
  const cadl = new CADL({ ...defaultConfig })
  beforeEach(() => {
    cadl.root.TestPage = { ...TestPage }
  })

  describe('should handle assignment commands', () => {
    it('with provided value', () => {
      return cadl['handleEvalCommands']({
        commands: { '.TestPage.testObj.red@': 4 },
        pageName: 'TestPage',
        key: '.TestPage.testObj.red@',
      }).then(() => {
        expect(cadl.root.TestPage.testObj.red).toEqual(4)
      })
    })
  })
  describe('should handle if commands', () => {
    it('should handle if commands with assignment expressions if true', () => {
      return cadl['handleEvalCommands']({
        commands: {
          if: [
            '.TestPage.testObj.red',
            { '.TestPage.testObj.red@': 10 },
            false,
          ],
        },
        pageName: 'TestPage',
        key: 'if',
      }).then(() => {
        expect(cadl.root.TestPage.testObj.red).toEqual(10)
      })
    })
    it('should handle if commands with assignment expressions if false', () => {
      return cadl['handleEvalCommands']({
        commands: {
          if: [
            '.TestPage.testObj.purple',
            false,
            { '.TestPage.testObj.red@': 11 },
          ],
        },
        pageName: 'TestPage',
        key: 'if',
      }).then(() => {
        expect(cadl.root.TestPage.testObj.red).toEqual(11)
      })
    })
  })
  describe('should handle function evaluations', () => {
    it('should handle evaluation of builtIn function', () => {
      return cadl['handleEvalCommands']({
        commands: {
          '=.builtIn.string.equal': {
            dataIn: {
              string1: 'male',
              string2: 'female',
            },
          },
        },
        pageName: 'TestPage',
        key: '=.builtIn.string.equal',
      }).then((res) => {
        expect(res).toEqual(false)
      })
    })
    it('should handle evaluation of ecos api function objects', () => {
      return cadl['handleEvalCommands']({
        commands: {
          '=.TestPage.edge.get': '',
        },
        pageName: 'TestPage',
        key: '=.TestPage.edge.get',
      }).then(() => {
        expect(edgeServices.get.mock.calls.length).toBe(1)
      })
    })
  })
})
