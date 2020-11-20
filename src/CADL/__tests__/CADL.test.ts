// @ts-nocheck
// import axios from 'axios'
import CADL from '../CADL'
import { isObject } from '../../utils'
import { UnableToRetrieveYAML } from '../errors'
import { defaultConfig } from '../../config'

describe('CADL', () => {
  describe('defaultObject', () => {
    // TODO: this is giving a "cannot parse YAML" error
    xtest('defaultObject returns an Object', () => {
      const cadl = new CADL({ ...defaultConfig })

      return cadl['defaultObject'](
        'https://s3.us-east-2.amazonaws.com/public.aitmed.com/cadl/aitmed_0.203.1/BaseDataModel_en.yml'
      ).then((data) => {
        expect(isObject(data)).toBe(true)
      })
    })
    test('defaultObject rejects an invalid url', () => {
      const cadl = new CADL({ ...defaultConfig })

      expect(cadl['defaultObject'](cadl['_pageUrl'])).rejects
    })
    test('defaultObject throws UnableToRetrieveYAML if something goes wrong in fetching the yaml', async () => {
      const cadl = new CADL({ ...defaultConfig })

      await expect(
        cadl['defaultObject'](cadl['_pageUrl'])
      ).rejects.toThrowError(UnableToRetrieveYAML)
    })
  })

  describe('init', () => {
    xit('should not have fetched BaseCSS if already given', () => {
      //
    })

    xit('should not have fetched BasePage if already given', () => {
      //
    })

    xit('should not have fetched BaseDataModel if already given', () => {
      //
    })

    xit('should fetch BaseCSS if it was not provided', () => {
      //
    })

    xit('should fetch BasePage if it was not provided', () => {
      //
    })

    xit('should fetch BaseDataModel if it was not provided', () => {
      //
    })
  })

  describe('initPage', () => {
    xit('should correctly populate dotted references in the initiated page', () => {
      //
    })

    xit('should correctly populate evaluated references in the initiated page', () => {
      //
    })

    xit('should correctly populate @ references in the initiated page', () => {
      //
    })
  })

  xdescribe('handleIfCommand', () => {
    const cadl = new CADL({ ...defaultConfig })

    it('should handle evalObject assignment syntax', () => {
      const TestPage = {
        var: {
          red: true,
          green: 4,
        },
        actions: [
          {
            if: [
              '.TestPage.var.red',
              { '.TestPage.var.green@': 9 },
              'continue',
            ],
          },
        ],
      }
      cadl.root.TestPage = TestPage

      return cadl['handleIfCommand']({
        ifCommand: TestPage.actions[0],
        pageName: 'TestPage',
      }).then(() => {
        debugger
        expect(cadl.root.TestPage.var.green).toEqual(9)
      })
    })
    it('should handle finding reference when path is given', () => {
      const TestPage = {
        var: {
          red: true,
          green: 4,
        },
        actions: [
          {
            if: [
              '.TestPage.var.red',
              { '.TestPage.var.green@': 9 },
              'continue',
            ],
          },
        ],
      }
      cadl.root.TestPage = TestPage

      return cadl['handleIfCommand']({
        ifCommand: TestPage.actions[0],
        pageName: 'TestPage',
      }).then(() => {
        debugger
        expect(cadl.root.TestPage.var.green).toEqual(9)
      })
    })
    describe('should handle boolean condition values', () => {
      it('should handle false condition', () => {
        const TestPage = {
          var: {
            red: true,
            green: 4,
          },
          actions: [
            { if: ['false', { '.TestPage.var.green@': 9 }, 'continue'] },
          ],
        }
        cadl.root.TestPage = TestPage

        return cadl['handleIfCommand']({
          ifCommand: TestPage.actions[0],
          pageName: 'TestPage',
        }).then(() => {
          debugger
          expect(cadl.root.TestPage.var.green).toEqual(4)
        })
      })
      it('should handle true condition', () => {
        const TestPage = {
          var: {
            red: true,
            green: 4,
          },
          actions: [
            {
              if: ['true', { '.TestPage.var.green@': 9 }, 'continue'],
            },
          ],
        }
        cadl.root.TestPage = TestPage

        return cadl['handleIfCommand']({
          ifCommand: TestPage.actions[0],
          pageName: 'TestPage',
        }).then(() => {
          debugger
          expect(cadl.root.TestPage.var.green).toEqual(9)
        })
      })
    })
  })

  describe('emitCall', () => {
    const cadl = new CADL({ ...defaultConfig })
    it('should handle evalObject function evaluations', () => {
      const TestPage = {
        generalInfo: {
          gender: '',
        },
        emit: {
          dataKey: {
            var: {
              key: 'gender',
              value: 'Female',
            },
          },
          actions: [
            {
              if: [
                {
                  '=.builtIn.string.equal': {
                    dataIn: {
                      string1: '$var.value',
                      string2: 'Male',
                    },
                  },
                },
                {
                  '=.builtIn.object.remove': {
                    dataIn: {
                      object: '=.TestPage.generalInfo',
                      key: '$var.key',
                    },
                  },
                },
                {
                  '=.builtIn.object.set': {
                    dataIn: {
                      object: '=.TestPage.generalInfo',
                      key: '$var.key',
                      value: 'Male',
                    },
                  },
                },
              ],
            },
          ],
        },
      }
      cadl.root.TestPage = TestPage
      return cadl['emitCall']({
        actions: TestPage.emit.actions,
        dataKey: TestPage.emit.dataKey,
        pageName: 'TestPage',
      }).then((res) => {
        debugger
        expect(cadl.root.TestPage.generalInfo.gender).toEqual('Male')
      })
    })
  })
})
