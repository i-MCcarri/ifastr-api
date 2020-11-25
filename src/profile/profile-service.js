const ArticlesService = {
    getUserProfile(knex) {
      return knex.select('*').from('users')
    },
    async getFastingLengthForTimer(knex, user_id) {
      let timerMethod = await knex
        .from('users')
        .select('users.method')
        .where('users.user_id', user_id);
      // return knex
      //   .join('users', 'users.method', 'fasting_methods.method_id')
      //   .select('users.user_id', 'users.fasting_start', 'fasting_methods.fasting_length')
      //   .where('users.user_id', user_id)
      let fasting_start = await knex
      .from('users')
      .select('users.fasting_start')
      .where('users.user_id', user_id);
      // let fasting_length = '';
      let fasting_length = await knex
      .from('fasting_methods')
      .select('fasting_methods.fasting_length')
      .where('fasting_methods.method_id', timerMethod[0].method);
      console.log(timerMethod[0].method, 
        fasting_start[0].fasting_start, 
        fasting_length[0].fasting_length)
      return {  
        method: timerMethod[0].method, 
        fasting_start: fasting_start[0].fasting_start, 
        fasting_length: fasting_length[0].fasting_length}
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
      return knex
        .from('users')
        .select('*')
        .where('user_id', user_id).first()
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