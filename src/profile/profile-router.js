const path = require('path')
const express = require('express')
const profilesService = require('./profile-service')
const MethodsService = require('../methods/methods-service')
//require Auth definition const {auth} = require('./')

const ProfilesRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
  id: user.user_id,
  firstname: user.firstname,
  lastname: user.lastname,
  username: user.username,
  email: user.email,
  cell: user.cell,
  verified_status: user.verified_status,
  join_date: user.join_date,
  method: user.method,
  fasting_start: user.fasting_start,
})

ProfilesRouter
  .route('/')
  //reach goal: require auth
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    profilesService.getUserProfile(knexInstance)
      .then(users => {
        res.json(users.map(serializeUser))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { firstname, lastname, username, email, cell } = req.body
    const newUser = { firstname, lastname, username, email, cell }

    for (const [key, value] of Object.entries(newUser))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    profilesService.insertUser(
      req.app.get('db'),
      newUser
    )
      .then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(serializeUser(user))
      })
      .catch(next)
  })

ProfilesRouter
  .route('/:user_id')
  .all((req, res, next) => {
    profilesService.getUserById(
      req.app.get('db'),
      req.params.user_id
    )
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` }
          })
        }
        res.user = user
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    // console.log(res.user)
    // console.log(serializeUser(res.user))
    res.json(serializeUser(res.user))
  })
  .delete((req, res, next) => {
    profilesService.deleteUser(
      req.app.get('db'),
      req.params.user_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { firstname, lastname, email, cell, pass } = req.body
    const userToUpdate = { firstname, lastname, email, cell, pass }

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either user data.`
        }
      })

    profilesService.updateProfile(
      req.app.get('db'),
      req.params.user_id,
      userToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

  ProfilesRouter
  .route('/method/:user_id')
  //no delete needed table data does not change
  //update user selected fasting method
  .patch(jsonParser, (req, res, next) => {
    const { method } = req.body
    const userMethodToUpdate = { method }
    // console.log(userMethodToUpdate)

    const numberOfValues = Object.values(userMethodToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain 'method'`
        }
      })

      profilesService.updateProfile(
      req.app.get('db'),
      req.params.user_id,
      userMethodToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

  ProfilesRouter
  .route('/fasting_start/:user_id')
  //update user selected fasting start time
  .patch(jsonParser, (req, res, next) => {
    const { fasting_start } = req.body
    const userFastingStartUpdate = { fasting_start }
    //console.log(userFastingStartUpdate)

    const numberOfValues = Object.values(userFastingStartUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain 'fasting_start'`
        }
      })
    }

    profilesService.updateProfile(
      req.app.get('db'),
      req.params.user_id,
      userFastingStartUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = ProfilesRouter