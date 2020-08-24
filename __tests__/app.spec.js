// Import the js file to test
import { addTrip } from "../src/client/js/app"

describe('Test, the function "addTrip()" should exist' , () => {
    test('It should return true', () => {
        expect(addTrip).toBeDefined();
    });
});

describe('Test, the function "addTrip()" should be a function', () => {
    test('It should be a function', () => {
        expect (typeof addTrip).toBe('function');
    });
});