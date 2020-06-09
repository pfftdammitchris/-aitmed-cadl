import { isObject } from '../index'

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
})