
const MethodsService = {
    getAllFastingMethods(knex) {
      return knex.select('*').from('fasting_methods')
    },
    insertMethod(knex, newMethod) {
      return knex
        .insert(newMethod)
        .into('users')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    getById(knex, id) {
      return knex.from('fasting_methods')
        .select('*')
        .where('id', id)
        .first()
    },
    //no delete needed 
    updatemethod(knex, user_id, newMethodFields) {
      return knex('users')
        .where({ user_id })
        .update(newMethodFields)
    },
  }
  
  module.exports = MethodsService