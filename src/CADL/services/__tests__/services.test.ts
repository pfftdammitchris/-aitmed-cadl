import array from '../array'
import utils from '../utils'

describe('Unit Testing Services', () => {
  // Test array services
  describe('Array Services', () => {
    test('array.add should add a deepcloned value to an array of strings', () => {
      const allergiesArray = ['peanut', 'raw fish', 'cat hair']
      array.add({ object: allergiesArray, value: 'feather' })
      expect(allergiesArray).toEqual([
        'peanut',
        'raw fish',
        'cat hair',
        'feather',
      ])
    })

    test('array.add should add a deepcloned value to an array of objects', () => {
      const carArray = [
        {
          owner: 'Jonathan',
          make: 'Ford',
        },
        {
          owner: 'Harry',
          make: 'Toyota',
        },
      ]
      const newCar = {
        owner: 'Daniel',
        make: 'Nissan',
      }
      const modifiedArray = [
        {
          owner: 'Jonathan',
          make: 'Ford',
        },
        {
          owner: 'Harry',
          make: 'Toyota',
        },
        {
          owner: 'Daniel',
          make: 'Nissan',
        },
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
          owner: 'Jonathan',
          make: 'Ford',
        },
        {
          owner: 'Harry',
          make: 'Toyota',
        },
      ]
      const testValue = {
        owner: 'Daniel',
        make: 'Nissan',
      }
      array.add({ object: testObject, value: testValue })
      expect(testObject[testObject.length - 1] === testValue).toBe(false)
    })
  })

  describe('Utils Services', () => {
    describe('exists', () => {
      it('should return false when a val is falsey', () => {
        const obj = { 0: '', 2: 'red' }
        expect(utils.exists(obj)).toEqual(false)
        const obj2 = { 0: undefined, 2: 'red' }
        expect(utils.exists(obj2)).toEqual(false)
        const obj3 = { 0: null, 2: 4 }
        expect(utils.exists(obj3)).toEqual(false)
      })
      it('should return true when all vals are truthy', () => {
        const obj = { 0: false, 2: 'red' }
        expect(utils.exists(obj)).toEqual(true)
      })
    })
  })
})
