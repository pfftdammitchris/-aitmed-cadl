import {
    //@ts-ignore
    filterDataModels,
    //@ts-ignore
    mergeDataModels,
    //@ts-ignore
    attachDocumentFns,
    //@ts-ignore
    attachEdgeFns,
    //@ts-ignore
    attachFns,
    isPopulated,
    replaceEidWithId,
    lookUp,
    populateObject,
    populateArray,
    populateString,
} from '../utils'
import { UnableToLocateValue } from '../../errors'

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
    describe('populateString', () => {
        test('it replaces string with val in a given location', () => {
            const source = '.dataModel.firstName'

            const locations = [
                {
                    dataModel: {
                        firstName: 'henry',
                        middleName: 'stan',
                    }
                },
            ]

            const populatedData = populateString({ source, lookFor: '.', locations })

            expect(populatedData).toEqual('henry')
        })
        test('it replaces string with val in a given multiple locations', () => {
            const source = '.dataModel.firstName'

            const locations = [
                {
                    dataModel: {
                        lastName: 'samson'
                    }
                },
                {
                    dataModel: {
                        firstName: 'henry'
                    }
                },
                {
                    dataModel: {
                        middle: 'dave'
                    }
                },
            ]

            const populatedData = populateString({ source, lookFor: '.', locations })

            expect(populatedData).toEqual('henry')
        })
        test('it returns the original string if val is not found in the given locations', () => {
            const source = '.dataModel.name'

            const locations = [
                {
                    dataModel: {
                        firstName: 'henry',
                        middleName: 'stan',
                    }
                },
            ]

            const populatedData = populateString({ source, lookFor: '.', locations })

            expect(populatedData).toEqual('.dataModel.name')
        })
    })

    describe('populateArray', () => {
        test('it populates the values of an array of strings', () => {
            const source = ['.dataModel.firstName', '.dataModel.middleName', 'red']

            const locations = [
                {
                    dataModel: {
                        firstName: 'henry',
                        middleName: 'stan',
                    }
                },
            ]

            const populatedData = populateArray({ source, lookFor: '.', locations })

            expect(populatedData).toEqual(['henry', 'stan', 'red'])
        })
        test('it populates the values of an array of strings and looks in multiple locations', () => {
            const source = ['.dataModel.firstName', '.dataModel.middle', 'red']

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

            const populatedData = populateArray({ source, lookFor: '.', locations })

            expect(populatedData).toEqual(['henry', 'dave', 'red'])
        })
        test('it populates the values of an array of objects', () => {
            const source = [{ firstName: '.dataModel.firstName' }, { middleName: '.dataModel.middleName' }, 'red']

            const locations = [
                {
                    dataModel: {
                        firstName: 'henry',
                        middleName: 'stan',
                    }
                },
            ]

            const populatedData = populateArray({ source, lookFor: '.', locations })

            expect(populatedData).toEqual([{ firstName: 'henry' }, { middleName: 'stan' }, 'red'])
        })
        test('it populates the values of an array of arrays', () => {
            const source = [
                [
                    { firstName: '.dataModel.firstName' },
                    { middleName: '.dataModel.middleName' },
                    '.dataModel.firstName',
                    '.dataModel.middleName'
                ],
                { firstName: '.dataModel.firstName' },
                { middleName: '.dataModel.middleName' },
            ]

            const locations = [
                {
                    dataModel: {
                        firstName: 'henry',
                        middleName: 'stan',
                    }
                },
            ]

            const populatedData = populateArray({ source, lookFor: '.', locations })

            expect(populatedData).toEqual([[{ firstName: 'henry' }, { middleName: 'stan' }, 'henry', 'stan'], { firstName: 'henry' },
            { middleName: 'stan' }])
        })
    })
    describe('populateObject', () => {
        test('it populates the values of a simple object', () => {
            const source = { firstName: '.dataModel.firstName' }

            const locations = [
                {
                    dataModel: {
                        firstName: 'henry',
                        middleName: 'stan',
                    }
                },
            ]

            const populatedData = populateObject({ source, lookFor: '.', locations })

            expect(populatedData).toEqual({ firstName: 'henry' })
        })
        test('it populates the values of an object with arrays', () => {
            const source = { firstName: ['.dataModel.firstName'] }

            const locations = [
                {
                    dataModel: {
                        firstName: 'henry',
                        middleName: 'stan',
                    }
                },
            ]

            const populatedData = populateObject({ source, lookFor: '.', locations })

            expect(populatedData).toEqual({ firstName: ['henry'] })
        })
        test('it populates the values of an object that has nested objects with dependent values', () => {
            const source = {
                company: {
                    name: 'aitmed',
                    position: 'developer'
                },
                job: '.company.position',
                employee: {
                    firstName: 'henry',
                    middleName: 'stan',
                    job: '.job'
                }
            }

            const locations = [
                {
                    company: {
                        name: 'aitmed',
                        position: 'developer'
                    },
                    job: '.company.position',
                    employee: {
                        firstName: 'henry',
                        middleName: 'stan',
                        job: '.job'
                    }
                },
            ]

            const populatedData = populateObject({ source, lookFor: '.', locations })

            expect(populatedData).toEqual( {
                company: {
                    name: 'aitmed',
                    position: 'developer'
                },
                job: 'developer',
                employee: {
                    firstName: 'henry',
                    middleName: 'stan',
                    job: 'developer'
                }
            },)
        })
        test('it populates the values of an object that contains array of arrays', () => {
            const source = {
                employees: [
                    [{ firstName: '.dataModel.firstName' },
                    { middleName: '.dataModel.middleName' }],
                    '.dataModel.firstName',
                    '.dataModel.middleName'
                ],
            }


            const locations = [
                {
                    dataModel: {
                        firstName: 'henry',
                        middleName: 'stan',
                    }
                },
            ]

            const populatedData = populateObject({ source, lookFor: '.', locations })

            expect(populatedData).toEqual({
                employees: [[{ firstName: 'henry' }, { middleName: 'stan' }], 'henry', 'stan']
            })
        })
        test('it populates the values of an object and looks in multiple locations', () => {
            const source = {
                employees: [
                    [{ firstName: '.dataModel.firstName' },
                    { middleName: '.dataModel.middle' }],
                    '.dataModel.lastName',
                    '.dataModel.middle'
                ],
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

            const populatedData = populateObject({ source, lookFor: '.', locations })

            expect(populatedData).toEqual({
                employees: [[{ firstName: 'henry' }, { middleName: 'dave' }], 'samson', 'dave']
            })
        })
    })
})