// @ts-nocheck
// import axios from 'axios'
import CADL from '../CADL'
import { isObject } from '../../utils'
import { UnableToRetrieveYAML } from '../errors'
import { defaultConfig } from '../../config'
import TestPage from '../__mocks__/TestPage'

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

  describe('handleIfCommand', () => {
    const cadl = new CADL({ ...defaultConfig })
    beforeEach(() => {
      cadl.root.TestPage = TestPage
    })
    // afterEach(() => {
    //   cadl.root.TestPage = TestPage
    // })

    it('should handle evalObject assignment syntax', () => {
      return cadl['handleIfCommand']({
        ifCommand: TestPage.actions[0],
        pageName: 'TestPage',
      }).then(() => {
        expect(cadl.root.TestPage.var.green).toEqual(9)
      })
    })
    it('should handle finding reference when path is given', () => {
      return cadl['handleIfCommand']({
        ifCommand: TestPage.actions[0],
        pageName: 'TestPage',
      }).then(() => {
        expect(cadl.root.TestPage.var.green).toEqual(9)
      })
    })
    describe('should handle boolean condition values', () => {
      // beforeEach(() => {
      //   const cadl = new CADL({ ...defaultConfig })
      //   cadl.root.TestPage = { ...TestPage }
      // })
      // afterEach(() => {
      //   cadl.root.TestPage = TestPage
      // })
      it('should handle false condition', () => {
        return cadl['handleIfCommand']({
          ifCommand: TestPage.actions1[0],
          pageName: 'TestPage',
        }).then(() => {
          expect(cadl.root.TestPage.var.green).toEqual(4)
        })
      })
      it('should handle true condition', () => {
        return cadl['handleIfCommand']({
          ifCommand: TestPage.actions[0],
          pageName: 'TestPage',
        }).then(() => {
          expect(cadl.root.TestPage.var.green).toEqual(9)
        })
      })
    })
  })

  describe('emitCall', () => {
    const cadl = new CADL({ ...defaultConfig })
    beforeEach(() => {
      cadl.root.TestPage = TestPage
    })
    it('should handle evalObject function evaluations', () => {
      return cadl['emitCall']({
        actions: TestPage.emit1.actions,
        dataKey: TestPage.emit1.dataKey,
        pageName: 'TestPage',
      }).then((res) => {
        expect(cadl.root.TestPage.generalInfo.gender).toEqual('Male')
      })
    })
    it('should handle evalObject assignment expressions', () => {
      return cadl['emitCall']({
        actions: TestPage.emit1.actions,
        dataKey: TestPage.emit1.dataKey,
        pageName: 'TestPage',
      }).then((res) => {
        expect(cadl.root.TestPage.generalInfo.gender).toEqual('Male')
      })
    })
    it('should handle return values', () => {
      return cadl['emitCall']({
        actions: TestPage.emit1.actions,
        dataKey: TestPage.emit1.dataKey,
        pageName: 'TestPage',
      }).then((res) => {
        expect(res[0]).toEqual('selectOn.png')
      })
    })
  })

  xdescribe('evalObject', () => {
    it('should evaluate value assignment', () => {})
  })
})
