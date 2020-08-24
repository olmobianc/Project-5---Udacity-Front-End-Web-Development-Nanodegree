//const request = require("supertest");

import { listening } from '../src/server/server';

test('listening', () => {
    expect(listening).toBeDefined();
});
