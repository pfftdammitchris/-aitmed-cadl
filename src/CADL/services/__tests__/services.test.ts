import array from '../array'

describe('Unit Testing Services', () => {
    // Test array services
    describe('Array Services', () => {
        test('array.add should add a deepcloned value to an array of strings', () => {
            const allergiesArray = ['peanut', 'raw fish', 'cat hair']
            array.add({ object: allergiesArray, value: 'feather' })
            expect(allergiesArray).toEqual(['peanut', 'raw fish', 'cat hair', 'feather'])
        })

        test('array.add should add a deepcloned value to an array of objects', () => {
            const carArray = [
                {
                    owner: "Jonathan",
                    make: "Ford"
                },
                {
                    owner: "Harry",
                    make: "Toyota"
                }
            ]
            const newCar = {
                owner: "Daniel",
                make: "Nissan"
            }
            const modifiedArray = [
                {
                    owner: "Jonathan",
                    make: "Ford"
                },
                {
                    owner: "Harry",
                    make: "Toyota"
                },
                {
                    owner: "Daniel",
                    make: "Nissan"
                }
            ]
            array.add({ object: carArray, value: newCar })
            expect(carArray).toEqual(modifiedArray)
        })

        test('no action is performed if object is not an array', () => {
            const testObject = "['peanut', 'raw fish', 'cat hair']"
            array.add({ object: testObject, value: 'feather' })
            expect(testObject).toBe("['peanut', 'raw fish', 'cat hair']")
        })

        test('no action is performed if value is not present', () => {
            const testObject = ['peanut', 'raw fish', 'cat hair']
            array.add({ object: testObject, value: null })
            expect(testObject).toEqual(['peanut', 'raw fish', 'cat hair'])
        })

        test('expects the function to deep clone', () => {
            const testObject = [
                {
                    owner: "Jonathan",
                    make: "Ford"
                },
                {
                    owner: "Harry",
                    make: "Toyota"
                }
            ]
            const testValue = {
                owner: "Daniel",
                make: "Nissan"
            }
            array.add({ object: testObject, value: testValue })
            expect(testObject[testObject.length - 1] === testValue).toBe(false)
        })
    })

})