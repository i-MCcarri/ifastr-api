const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const { expect } = require('chai')
const supertest = require('supertest')

describe('Users Endpoints', function() {
    let db

    const { testUsers } = helpers.makeiFastrFixtures()
    const testUser = testUsers[0]

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

    describe(`POST /users`, () => {
        context(`User Validation`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db,
                    testUsers,
                )
            )
            
            const requiredFields = ['firstname', 'lastname', 'username', 'email', 'cell', 'pass']

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    firstname: 'test-name',
                    lastname: 'name-test',
                    username: 'test-username',
                    email: 'email@email.com',
                    cell: '(555)555-5555',
                    pass: 'test-Password1',
                }

                it(`responds with 400 required error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field]
    
                    return supertest(app)
                        .post('/users')
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`,
                        })
                })
            })

            it(`responds 400 'Username must be less than 20 characters' when long username`, () => {
                const userLongUsername = {
                    firstname: 'test-name',
                    lastname: 'name-test',
                    username: '*'.repeat(21),
                    email: 'email@email.com',
                    cell: '(555)555-5555',
                    pass: 'test-password',
                }
                return supertest(app)
                    .post('/users')
                    .send(userLongUsername)
                    .expect(400, { error: `Username must be less than 20 characters` })
            })

            it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
                const userShortPassword = {
                    firstname: 'test-name',
                    lastname: 'name-test',
                    username: 'test-username',
                    email: 'email@email.com',
                    cell: '(555)555-5555',
                    pass: '1234567',
                }
                return supertest(app)
                    .post('/api/user')
                    .send(userShortPassword)
                    .expect(400, { error: `Password must be longer than 8 characters` })
            })
    
            it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
                const userLongPassword = {
                    firstname: 'test-name',
                    lastname: 'name-test',
                    username: 'test-username',
                    email: 'email@email.com',
                    cell: '(555)555-5555',
                    pass: '*'.repeat(73),
                }
                return supertest(app)
                    .post('/users')
                    .send(userLongPassword)
                    .expect(400, { error: `Password must be less than 72 characters` })
            })
    
            it(`responds 400 error when password starts with spaces`, () => {
                const userPasswordStartsSpaces = {
                    firstname: 'test-name',
                    lastname: 'name-test',
                    username: 'test-username',
                    email: 'email@email.com',
                    cell: '(555)555-5555',
                    pass: ' test-Password1',
                }
                return supertest(app)
                    .post('/users')
                    .send(userPasswordStartsSpaces)
                    .expect(400, { error: `Password must not start or end with empty spaces` })
            })
    
            it(`responds 400 error when password ends with spaces`, () => {
                const userPasswordEndsSpaces = {
                    firstname: 'test-name',
                    lastname: 'name-test',
                    username: 'test-username',
                    email: 'email@email.com',
                    cell: '(555)555-5555',
                    pass: 'test-Password1 ',
                }
                return supertest(app)
                    .post('/users')
                    .send(userPasswordEndsSpaces)
                    .expect(400, { error: `Password must not start or end with empty spaces` })
            })
    
            it(`responds 400 error when password isn't complex enough`, () => {
                const userPasswordNotComplex = {
                    firstname: 'test-name',
                    lastname: 'name-test',
                    username: 'test-username',
                    email: 'email@email.com',
                    cell: '(555)555-5555',
                    pass: 'test-Password',
                }
                return supertest(app)
                    .post('/users')
                    .send(userPasswordNotComplex)
                    .expect(400, { error: `Password must contain 1 upper case, lower case, number and special character` })
            })

            it(`responds 400 error when email is not a valid address`, () => {
                const emailInvalidFormat = {
                    firstname: 'test-name',
                    lastname: 'name-test',
                    username: 'test-username',
                    email: 'incorrect',
                    cell: '(555)555-5555',
                    pass: 'test-Password1',
                }
                return supertest(app)
                    .post('/user')
                    .send(emailInvalidFormat)
                    .expect(400, { error: `Email must be a valid address`})

            })
    
            it(`responds 400 'Username already taken' when username isn't unique`, () => {
                const duplicateUser = {
                    firstname: 'test-name',
                    lastname: 'name-test',
                    username: testUser.username,
                    email: 'email@email.com',
                    cell: '(555)555-5555',
                    pass: 'test-Password1',
                }
                return supertest(app)
                    .post('/user')
                    .send(duplicateUser)
                    .expect(400, { error: `Username already taken` })
            })

            it(`responds 400 'Email is already associated with an user account' when email isn't unique`, () => {
                const duplicateUser = {
                    firstname: 'test-name',
                    lastname: 'name-test',
                    username: 'test-username',
                    email: testUser.email,
                    cell: '(555)555-5555',
                    pass: 'test-Password1',
                }
                return supertest(app)
                    .post('/user')
                    .send(duplicateUser)
                    .expect(400, { error: `Email is already associated with an user account` })
            })

            context(`Happy path`, () => {
                it(`responds 201, serialized user, storing bcrypted password`, () => {
                    const newUser = {
                        firstname: 'test-name',
                        lastname: 'name-test',
                        username: 'test-username',
                        email: 'email@email.com',
                        cell: '(555)555-5555',
                        pass: 'test-Password1',
                    }
                    return supertest(app)
                        .post('/user')
                        .send(newUser)
                        .expect(201)
                        .expect(res => {
                            expect(res.body).to.have.property('id')
                            expect(res.body.firstname).to.eql(newUser.firstname)
                            expect(res.body.lastname).to.eql(newUser.lastname)
                            expect(res.body.username).to.eql(newUser.username)
                            expect(res.body.email).to.eql(newUser.email)
                            expect(res.body.cell).to.eql(newUser.cell)
                            // expect(res.body).to.not.have.property('test-Password1')
                            expect(res.body.join_date).to.eql(newUser.join_date)
                            expect(res.headers.location).to.eql(`/user/${res.body.id}`)
                            const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                            const actualDate = new Date(res.body.join_date).toLocaleString()
                            expect(actualDate).to.eql(expectedDate)
                        })
                        .expect(res =>
                            db
                                .from('user_information')
                                .select('*')
                                .where({ id: res.body.id })
                                .first()
                                .then(row => {
                                    expect(row.fullname).to.eql(newUser.fullname)
                                    expect(row.username).to.eql(newUser.username)
                                    expect(row.email).to.eql(newUser.email)
                                    expect(row.about_user).to.eql(newUser.about_user)
                                    expect(row.user_stack).to.eql(newUser.user_stack)
                                    const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                                    const actualDate = new Date(row.date_created).toLocaleString()
                                    expect(actualDate).to.eql(expectedDate)
    
                                    return bcrypt.compare(newUser.user_password, row.user_password)
                                })
                                .then(compareMatch => {
                                    expect(compareMatch).to.be.true
                                })
                            )
                })
            })
        })
    })
})