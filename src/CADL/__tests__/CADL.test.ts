// @ts-nocheck
// import axios from 'axios'
import CADL from '../CADL'
import { isObject } from '../../utils'
import {
    UnableToRetrieveYAML
} from '../errors'
import { defaultConfig } from '../../config'



describe('CADL', () => {

    describe('defaultObject', () => {
        // TODO: this is giving a "cannot parse YAML" error
        xtest('defaultObject returns an Object', () => {
            const cadl = new CADL({ ...defaultConfig })

            return cadl['defaultObject']('https://s3.us-east-2.amazonaws.com/public.aitmed.com/cadl/aitmed_0.203/BaseDataModel_en.yml').then(data => {
                expect(isObject(data)).toBe(true)
            })
        })
        test('defaultObject rejects an invalid url', () => {

            const cadl = new CADL({ ...defaultConfig })

            expect(cadl['defaultObject'](cadl['_pageUrl'])).rejects
        })
        test('defaultObject throws UnableToRetrieveYAML if something goes wrong in fetching the yaml', async () => {

            const cadl = new CADL({ ...defaultConfig })

            await expect(cadl['defaultObject'](cadl['_pageUrl'])).rejects.toThrowError(UnableToRetrieveYAML)
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
})