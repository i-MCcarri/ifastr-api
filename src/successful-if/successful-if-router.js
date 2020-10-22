const path = require('path')
const express = require('express')
const SuccessfulIFService = require('./succesful-if-service')
//require Auth definition const {auth} = require('./')

const successfulIFRouter = express.Router()
const jsonParser = express.json()

const serializeSuccessfulIF = tracker => ({
  fastingId: tracker.fastingId,
  fastingStart: tracker.fastingStart,
  fastingLength: tracker.fastingLength,
  feastStart: tracker.featStart,
  completed: tracker.completed,
})

successfulIFRouter
  .route('/')
  //require auth of login
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    SuccessfulIFService.getAllSuccessfulIF(knexInstance)
      .then(tracker => {
        res.json(tracker.map(serializeSuccessfulIF))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { fastingStart, fastingLength, feastStart, completed } = req.body
    const newSuccessfulIF = { fastingStart, fastingLength, feastStart, completed }

    for (const [key, value] of Object.entries(newSuccessfulIF))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    SuccessfulIFService.insertSuccessfulIF(
      req.app.get('db'),
      newSuccessfulIF
    )
      .then(tracker => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${tracker.fastingId}`))
          .json(serializeSuccessfulIF(tracker))
      })
      .catch(next)
  })

successfulIFRouter
  .route('/:fasting_id')
  //require auth of login 
  .all((req, res, next) => {
    SuccessfulIFService.getById(
      req.app.get('db'),
      req.params.fasting_id
    )
      .then(fasting => {
        if (!fasting) {
          return res.status(404).json({
            error: { message: `Fast doesn't exist` }
          })
        }
        res.fasting = fasting
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeSuccessfulIF(res.fasting))
  })
  // delete not needed to track and store all fasting data
  .patch(jsonParser, (req, res, next) => {
    const { fastingStart, fastingLength, feastStart, completed } = req.body
    const successfulIFToUpdate = { fastingStart, fastingLength, feastStart, completed }

    const numberOfValues = Object.values(successfulIFToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'fastingStart', 'fastingLength', 'feastStart', 'completed'.`
        }
      })

    SuccessfulIFService.updateSuccessfulIF(
      req.app.get('db'),
      req.params.fasting_id,
      successfulIFToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = successfulIFRouter