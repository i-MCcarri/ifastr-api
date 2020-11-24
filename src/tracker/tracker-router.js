const path = require('path')
const express = require('express')
const TrackerService = require('./tracker-service')
const { start } = require('repl')
//require Auth definition: const {auth} = require('./')

const TrackerRouter = express.Router()
const jsonParser = express.json()

const serializeTracker = tracker => ({
  id: tracker.fasting_id, 
  fasting_start: tracker.fasting_start, 
  fasting_length: tracker.fasting_length, 
  feast_start: tracker.feast_start, 
  completed: tracker.completed, 
})

//Route for IF tracker of ifastr table: fasting_tracker
TrackerRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    TrackerService.getAllTracker(knexInstance)
      .then(trackers => {
        res.json(trackers.map(serializeTracker))
      })
      .catch(next)
  })
  //No delete needed, post and store all fasting data for data tracker
  .post(jsonParser, (req, res, next) => {
    const { fasting_start, fasting_length, feast_start, completed } = req.body
    const newTracker = { fasting_start, fasting_length, feast_start, completed }

    for (const [key, value] of Object.entries(newTracker))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    TrackerService.insertTracker(
      req.app.get('db'),
      newTracker
    )
      .then(tracker => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${tracker.id}`))
          .json(serializeTracker(tracker))
      })
      .catch(next)
  })

TrackerRouter
  .route('/completed/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    TrackerService.getCompletedFastData(knexInstance)
      .then(trackers => {
        res.json(trackers.map(serializeTracker))
      })
      .catch(next)
    })
  .patch(jsonParser, (req, res, next) => {
    const { fasting_start, fasting_length, feast_start, completed } = req.body
    const trackersToUpdate = { fasting_start, fasting_length, feast_start, completed }

    const numberOfValues = Object.values(trackersToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content a fast.`
        }
      })

    TrackerService.updateTracker(
      req.app.get('db'),
      req.params.fasting_id,
      trackerToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

 //Later use with fetch by date
  TrackerRouter
  .route('/:fasting_id')
  .all((req, res, next) => {
    TrackerService.getTrackerById(
      req.app.get('db'),
      req.params.fasting_id
    )
      .then(tracker => {
        if (!tracker) {
          return res.status(404).json({
            error: { message: `Fast doesn't exist` }
          })
        }
        res.tracker = tracker
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeTracker(res.tracker))
  })
  .patch(jsonParser, (req, res, next) => {
    const { fasting_start, fasting_length, feast_start, completed } = req.body
    const trackerToUpdate = { fasting_start, fasting_length, feast_start, completed }

    const numberOfValues = Object.values(trackerToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'fasting start', 'fasting length', 'feast start', or 'completed'`
        }
      })

    TrackerService.updateTracker(
      req.app.get('db'),
      req.params.fasting_id,
      trackerToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = TrackerRouter