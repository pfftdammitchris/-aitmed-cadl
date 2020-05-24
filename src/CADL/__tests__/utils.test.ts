//@ts-ignore
import CADL from '../CADL'
import {
    //@ts-ignore
    filterDataModels,
    //@ts-ignore
    mergeDataModels,
    //@ts-ignore
    populateData,
    //@ts-ignore
    attachDocumentFns,
    //@ts-ignore
    attachEdgeFns,
    //@ts-ignore
    attachFns,
    isPopulated,
    replaceEidWithId,
    lookUp
} from '../utils'
//@ts-ignore
import { UnableToLocateValue } from '../errors'

describe('utils', () => {
    describe('replaceEidWithId', () => {
        test('replaces object.eid with object.id ', () => {
            expect(replaceEidWithId({ eid: '12345' })).toEqual({ id: '12345' })
        })
        test('returns input if no eid is found ', () => {
            expect(replaceEidWithId({ yid: '12345' })).toEqual({ yid: '12345' })
            expect(replaceEidWithId({})).toEqual({})
        })
    })

    describe('isPopulated', () => {
        test('returns false if it finds a value that begins with "."', () => {
            const data = { name: '.dataModel.name' }
            const nestedData = {
                name: {
                    firstName: '.dataModel.name',
                    lastName: '.dataModel.name'
                },
                company: {
                    employee: {
                        firstName: '.dataModel.name'
                    }
                }
            }
            expect(isPopulated(data)).toBe(false)
            expect(isPopulated(nestedData)).toBe(false)
        })
        test('returns true if it doesnt find a value that begins with "."', () => {
            const data = { name: 'henry' }
            const nestedData = {
                name: {
                    firstName: 'henry',
                    lastName: 'willerd'
                },
                company: {
                    employee: {
                        firstName: 'sam'
                    }
                }
            }
            expect(isPopulated(data)).toBe(true)
            expect(isPopulated(nestedData)).toBe(true)
        })
    })

    describe('populateData', () => {
        test('it populates an object with values of another', () => {
            const source = { name: '.dataModel.name' }
            const location = {
                dataModel: {
                    name: 'henry'
                }
            }

            const populatedData = populateData(source, [location])

            expect(populatedData).toEqual({ name: 'henry' })
        })

        test('it returns the input object if no values were populated', () => {
            const source = { name: '.dataModel.name' }
            const location = {
                dataModel: {
                    firstName: 'henry'
                }
            }

            const populatedData = populateData(source, [location])

            expect(populatedData).toEqual(source)
        })
        test('looks for values in multiple locations', () => {
            const source = {
                employee: {
                    firstName: '.dataModel.firstName',
                    middle: '.dataModel.middle',
                    lastName: '.dataModel.lastName'
                }
            }
            const locations = [
                {
                    dataModel: {
                        firstName: 'henry'
                    }
                },
                {
                    dataModel: {
                        lastName: 'samson'
                    }
                },
                {
                    dataModel: {
                        middle: 'dave'
                    }
                },
            ]

            const populatedData = populateData(source, locations)

            expect(populatedData).toEqual({ employee: { firstName: 'henry', middle: 'dave', lastName: 'samson' } })
        })

        test('it doesnt throw an error if values are not found', () => {
            const source = { name: '.dataModel.name' }
            const location = {
                data: {
                    name: 'henry'
                }
            }
            expect(() => populateData(source, [location])).not.toThrow()
        })
    })

    describe('lookUp', () => {
        test('it returns the value matching the given directions', () => {
            const directions = '.dataModels.firstName'
            const location = {
                dataModels: {
                    firstName: 'henry'
                }
            }
            expect(lookUp(directions, location)).toEqual('henry')
        })
        test('it throws error if value is not found', () => {
            const directions = '.dataModel.name'
            const location = {
                dataModels: {
                    firstName: 'henry'
                }
            }
            expect(() => lookUp(directions, location)).toThrowError(UnableToLocateValue)
        })
    })
})