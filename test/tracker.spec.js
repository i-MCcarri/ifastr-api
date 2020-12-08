const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const { expect } = require('chai')
const supertest = require('supertest')

describe('tracker endpoints', () => {
    let db;

    const { testFasts } = helpers.makeInitFixtures()
    

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

    describe('GET, fasting tracker', function () {

        beforeEach('insert fasting data', () =>
            helpers.seedFasts(
                db,
                testFasts,
            )
        )

        describe('fetch fasting data',() => {

            it('Responds with a 200 and an array of comments', async () => {
                let res = await supertest(app)
                    .get(`/fasting_tracker/`)
                expect(res.status).to.equal(200, testFasts);
            })
        })
    })

    describe('POST insert fasts', () => {

        beforeEach('insert fasting data', () =>
            helpers.seedFasts(
                db,
                testFasts,
            )
        )

        const requiredFields = ['fasting_start', 'fasting_length', 'feast_start', 'completed']

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    fasting_id: 5,
                    fasting_start: '20:00:00',
                    fasting_length: 20,
                    feast_start: '2020-10-02 16:00:00+00',
                    completed: true
                }
        
            context(`POST`, () => {
                it(`responds 200, serialized fast`, () => {
                    const newFast = {
                        fasting_start: '20:00:00',
                        fasting_length: 20,
                        feast_start: '2020-10-02 16:00:00+00',
                        completed: true
                    }
                    return supertest(app)
                        .post('/')
                        .send(newFast)
                        .expect(200)
                        .expect(res => {
                            expect(res.body).to.have.property('fasting_id')
                            expect(res.body.fasting_start).to.eql(newFast.fasting_start)
                            expect(res.body.fasting_length).to.eql(newUser.fasting_length)
                            expect(res.body.feast_start).to.eql(newUser.feast_start)
                            expect(res.body.completed).to.eql(newUser.completed)
                        })    
        })
    })
})

//coming soon:
// ---- path /completed/
//get
//patch

// ---- path /completed/
//get
//patch