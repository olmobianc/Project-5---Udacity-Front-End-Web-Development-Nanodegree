//const request = require("supertest");

//import { listening } from '../src/client/js/listening';
const listening = require("../src/client/js/listening");

test('listening', () => {
    expect(listening).toBeDefined();
});
