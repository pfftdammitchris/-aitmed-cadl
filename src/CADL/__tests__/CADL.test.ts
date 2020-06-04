import CADL from '../CADL'
import { isObject } from '../../utils'
import {
    UnableToRetrieveYAML
} from '../errors'


describe('CADL', () => {

    describe('defaultObject', () => {
        test('defaultObject returns an Object', () => {
        //@ts-ignore

            const cadl = new CADL('https://s3.us-east-2.amazonaws.com/public.aitmed.com/alpha/BaseDataModel_en.yml', 'https://s3.us-east-2.amazonaws.com/public.aitmed.com/cadl/aitmed_0.203/ApplyBusiness_en.yml')

            return cadl['defaultObject'](cadl['_pageUrl']).then(data => {
                expect(isObject(data)).toBe(true)
            })
        })
        test('defaultObject rejects an invalid url', () => {
        //@ts-ignore

            const cadl = new CADL('https://s3.us-east-2.amazonaws.com/public.aitmed.com/alpha/BaseDataModel_en.yml', 'https://s3.us-east-2.amazonaws.com/psasaublic.aitmed.com/cadl/aitmed_0.203/ApplyBusiness_en.yml')

            expect(cadl['defaultObject'](cadl['_pageUrl'])).rejects
        })
        test('defaultObject throws UnableToRetrieveYAML if something goes wrong in fetching the yaml', async () => {
        //@ts-ignore

            const cadl = new CADL('https://s3.us-east-2.amazonaws.com/public.aitmed.com/alpha/BaseDataModel_en.yml', 'https://s3.us-east-2.amazonaws.com/psasaublic.aitmeddsds.com/cadl/aitmed_0.203/ApplyBusiness_en.yml')

            await expect(cadl['defaultObject'](cadl['_pageUrl'])).rejects.toThrowError(UnableToRetrieveYAML)
        })
    })
})