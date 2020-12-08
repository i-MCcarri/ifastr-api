require('dotenv').config()

function makeUsersArray() {
    return [
        {
            user_id: 1,
            firstname: 'tester1',
            lastname: 'testing1',
            username: 'test-user-1',
            email: 'email@email.com',
            cell: '(555)555-5551',
            pass: 'password',
            verified_status: 'false',
            join_date: new Date().toISOString(),
            method: '1',
            fasting_start: '20:00:00',
        },
        {
            user_id: 2,
            firstname: 'tester2',
            lastname: 'testing2',
            username: 'test-user-2',
            email: 'email2@email.com',
            cell: '(555)555-5552',
            pass: 'password',
            verified_status: 'false',
            join_date: new Date().toISOString(),
            method: '4',
            fasting_start: '15:00:00',
        },
        {
            user_id: 3,
            firstname: 'tester3',
            lastname: 'testing3',
            username: 'test-user-3',
            email: 'email3@email.com',
            cell: '(555)555-5553',
            pass: 'password',
            verified_status: 'false',
            join_date: new Date().toISOString(),
            method: '7',
            fasting_start: '10:00:00'
        },
        {
            user_id: 4,
            firstname: 'tester4',
            lastname: 'testing4',
            username: 'test-user-4',
            email: 'email@email.com',
            cell: '(555)555-5554',
            pass: 'password',
            verified_status: 'false',
            join_date: new Date().toISOString(),
            method: '3',
            fasting_start: '2:00:00'
        }
    ]
}

function makeiFastrFixtures() {
    const testMethods = makeMethodsArray()
    const testUsers = makeUsersArray()
    const testFasts = makeFastsArray()
    return { testMethods, testUsers, testFasts }
}

function seedMethods(db, arr) {

    return db
        .insert(arr)
        .into('fasting_methods')

}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user
    }))
    return db.into('users').insert(preppedUsers)
        .then(() =>
            db.raw(
                `SELECT setval('users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
}

function makeMethodsArray() {
    return [
        {
            method_id: 1,
            method_options: '20:4', 
            fasting_length: '20', 
            feast_length: 4
        },
        { 
            method_id: 2,
            method_options: '19:5', 
            fasting_length: 19, 
            feast_length: 5
        },
        {
            method_id: 3,
            method_options: '18:6', 
            fasting_length: 18, 
            feast_length: 6
        },
        {
            method_id: 4,
            method_options: '17:7', 
            fasting_length: 17, 
            feast_length: 7
        },
        {
            method_id: 5,
            method_options: '16:8', 
            fasting_length: 16, 
            feast_length: 8
        },
        {
            method_id: 6,
            method_options: '15:9', 
            fasting_length: 15, 
            feast_length: 9
        },
        {
            method_id: 7,
            method_options: '14:10', 
            fasting_length: 14, 
            feast_length: 10
        }
    ]
}

function makeFastsArray() {
    return [
        {
            fasting_id: 1,
            fasting_start: '20:00:00',
            fasting_length: 20,
            feast_start: '2020-10-02 16:00:00+00',
            completed: true,
        },
        {
            fasting_id: 2,
            fasting_start: '15:00:00',
            fasting_length: 17,
            feast_start: '2020-10-02 7:15:00+00',
            completed: false,
        },
        {
            fasting_id: 3,
            fasting_start: '10:00:00',
            fasting_length: 14,
            feast_start: '2020-10-02 0:00:00+00',
            completed: true,
        },
        {
            fasting_id: 4,
            fasting_start: '2:00:00',
            fasting_length: 18,
            feast_start: '2020-10-02 18:30:00+00',
            completed: false,
        }
    ]
}

function seedFasts(db, arr) {
    return db
        .insert(arr)
        .into('fasting_tracker')
}

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
                fasting_method,
                users,
                fasting_tracker
            `
        )
            .then(() =>
                Promise.all([
                    trx.raw(`ALTER SEQUENCE fasting_methods_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE fasting_tracker_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('fasting_methods_id_seq', 0)`),
                    trx.raw(`SELECT setval('users_id_seq', 0)`),
                    trx.raw(`SELECT setval('following_tracker_id_seq', 0)`),
                ])
            )
    )
}

module.exports = {
    makeMethodsArray,
    makeUsersArray,
    makeFastsArray,
    makeiFastrFixtures,
    seedMethods,
    seedUsers,
    seedFasts,
    cleanTables,
}