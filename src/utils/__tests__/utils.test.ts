import { isObject, mergeDeep } from '../index'

describe('utils', () => {
    describe('isObject', () => {
        test('it returns false if argument is null', () => {
            expect(isObject(null)).toBeFalsy
        })
        test('it returns false if argument is undefined', () => {
            expect(isObject(undefined)).toBeFalsy
        })
        test('it returns false if argument is a string', () => {
            expect(isObject('hello')).toBeFalsy
            expect(isObject('')).toBeFalsy
        })
        test('it returns false if argument is a number', () => {
            expect(isObject(123)).toBeFalsy
        })
        test('it returns false if argument is an array', () => {
            expect(isObject([1,2])).toBeFalsy
            expect(isObject([])).toBeFalsy
            expect(isObject([{}])).toBeFalsy
        })
       
        test('it returns true if the argument is an object', () => {
            expect(isObject({})).toBeTruthy
            expect(isObject({x:'red'})).toBeTruthy
        })
    })
    
    describe('mergeDeep', () => {
        const target = {
            a: {
                b: {
                  g: 'g123',
                  d: {
                      e: 'fffff'
                  }
                },
                c: {
                    d: [
                        { e: [], g: [], z: 'aldadslah' }
                    ]
                }
            }
        }
        const source = {
            a: {
                b: {
                    pp123: 123,
                    c: {
                        d: [
                            { e: [], f: 'abcf123' }
                        ],
                        g: {}
                    }
                }
            }
        }

      it('should merge nested objets', () => {
          expect(mergeDeep(target, source)).toEqual({
              a: {
                  b: {
                      g: 'g123',
                      d: {
                          e: 'fffff'
                      },
                      pp123: 123,
                      c: source.a.b.c,
                  },
                  c: target.a.c
              }
          })
      })

      it('should not have been merged correctly', () => {
        expect(mergeDeep(target, source)).not.toEqual({
            a: {
                ...target.a,
                ...target.a.b,
                c: target.a.c
            }
        })
      })
    })
})