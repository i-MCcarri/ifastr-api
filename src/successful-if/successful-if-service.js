const SuccessfulIFService = {
    getAllSuccessfulIF(knex) {
      return knex.select('*').from('ifastr_tracker')
    },
    insertSuccessfulIF(knex, newSuccessfulIF) {
      return knex
        .insert(newSuccessfulIF)
        .into('ifastr_tracker')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    getById(knex, id) {
      return knex.from('ifastr_tracker').select('*').where('id', id).first()
    },
    // delete not needed to track and store all fasting data
    updateSuccessfulIF(knex, id, newSuccessfulIFFields) {
      return knex('ifastr_tracker')
        .where({ id })
        .update(newSuccessfulIFFields)
    },
  }
  
  module.exports = SuccessfulIFService