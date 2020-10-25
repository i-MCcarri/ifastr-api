
const MethodsService = {
    getAllFastingMethods(knex) {
      return knex.select('*').from('fasting_methods')
    },
    insertMethod(knex, newMethod) {
      return knex
        .insert(newMethod)
        .into('ifastr_users')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    getById(knex, id) {
      return knex.from('fasting_methods').select('*').where('id', id).first()
    },
    //no delete needed 
    updatemethod(knex, id, newMethodFields) {
      return knex('ifastr_users')
        .where({ id })
        .update(newMethodFields)
    },
  }
  
  module.exports = MethodsService