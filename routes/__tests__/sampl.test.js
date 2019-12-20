//
const mongoose = require('mongoose');
const UserModel = require('../../models/user');
const ColumnModel = require('../../models/column');
const CardModel = require('../../models/card');
const request = require('supertest');
const axios = require('../../axios');

describe('Sample Test', () => {
    it('should test that true === true', () => {
        expect(true).toBe(true)
    })
});
describe('Column Endpoints', () => {
    beforeAll(async () => {
        await mongoose.connect("mongodb://localhost/trello", { useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true  }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });
    it('should return all columns', async () => {
        const res = await axios("/columns/");


        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message')
    })
});
