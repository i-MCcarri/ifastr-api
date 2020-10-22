const ArticlesService = {
    getAllUserProfile(knex) {
      return knex.select('*').from('ifastr_users')
    },
    insertUser(knex, newUser) {
      return knex
        .insert(newUser)
        .into('ifastr_users')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    getUserById(knex, id) {
      return knex.from('ifastr_users').select('*').where('id', id).first()
    },
    deleteUser(knex, id) {
      return knex('ifastr_users')
        .where({ id })
        .delete()
    },
    updateProfile(knex, id, newUserFields) {
      return knex('ifastr_users')
        .where({ id })
        .update(newUserFields)
    },
  }
  
  module.exports = ArticlesService