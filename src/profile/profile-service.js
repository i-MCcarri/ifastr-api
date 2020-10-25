const ArticlesService = {
    getUserProfile(knex) {
      return knex.select('*').from('users')
    },
    insertUser(knex, newUser) {
      return knex
        .insert(newUser)
        .into('users')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    getUserById(knex, user_id) {
      return knex.from('users').select('*').where('user_id', user_id).first()
    },
    deleteUser(knex, user_id) {
      return knex('users')
        .where( 'user_id', user_id )
        .delete()
    },
    updateProfile(knex, user_id, newUserFields) {
      return knex('users')
        .where( 'user_id', user_id )
        .update(newUserFields)
    },
  }
  
  module.exports = ArticlesService