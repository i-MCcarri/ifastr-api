const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const { expect } = require('chai')
const supertest = require('supertest')

describe('Method Endpoints', function () {
    let db;

    const { testMethods } = helpers.makeiFastrFixtures()
    // const testMethod = testMethods[0]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))


    describe(`GET /fasting_methods`, () => {

        beforeEach('insert users', () =>
            helpers.seedMethods(
                db,
                testMethods,
            )
        )

        describe('Given that Methods are predetermined',() => {
            it(`Responds with 200 and an object of all Methods`, async () => {
                let res = await supertest(app)
                    .get(`/fasting_methods`)
                expect(res.status).to.equal(200);
                expect(res.body.knexInstance[0]).to.be.an('object')
                expect(res.body.knexInstance[0]).to.include.all.keys('method_id', 'method_options', 'fasting_length', 'feast_length' )
            })
        })
    })
    //coming soon
    describe(`POST /users`, () => {

        beforeEach('insert fasting method', () =>
            helpers.seedMethods(
                db,
                testMethods,
            )
        )

        describe('Given that a user has not already set their chosen method', () => {

            it('Responds with a 200 and creates new row in followers table', () => {
                return supertest(app)
                    .post(`/fasting_methods`)
                    .send({ method: newmethod[7].method_id })
                    .expect(200)
            })
        })
    })
})