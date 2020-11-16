const TrackerService = {
    getAllTracker(knex) {
      return knex.select('*').from('fasting_tracker')
    },
    getCompletedFastData(knex) {
      return knex
        .from('fasting_tracker')
        .select('*')
        .where('completed', true)
    },
    // getDayOfTheWeekFromDate(knex) {
    //   return 
    //   knex.raw(select('*') 
    //   .from('fasting_tracker'))
    // },
    insertTracker(knex, newTracker) {
      return knex
        .insert(newTracker)
        .into('fasting_tracker')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    getTrackerById(knex, fasting_id) {
      return knex.from('fasting_tracker').select('*').where('fasting_id', fasting_id).first()
    },
    //No delete needed, post and store all fasting data for data review
    updateTracker(knex, fasting_id, newTrackerFields) {
      return knex('fasting_tracker')
        .where( 'fasting_id', fasting_id )
        .update(newTrackerFields)
    },
  }
  
  module.exports = TrackerService