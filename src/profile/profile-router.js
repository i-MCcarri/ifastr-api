const path = require('path')
const express = require('express')
const profilesService = require('./profile-service')
//require Auth definition const {auth} = require('./')

const ProfilesRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
  id: user.user_id,
  first_name: user.firstname,
  last_name: user.lastname,
  username: user.username,
  email: user.email,
  cell: user.cell,
  pass: user.pass,
  verified_status: user.verified_status,
  join_date: user.join_date,
  method: user.method,
  fasting_start: user.fasting_start,
})

ProfilesRouter
  .route('/')
  //require auth reach goal
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    profilesService.getUserProfile(knexInstance)
      .then(users => {
        res.json(users.map(serializeUser))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { firstname, lastname, username, email, cell, pass, verified_status } = req.body
    const newUser = { firstname, lastname, username, email, cell, pass, verified_status }

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
          message: `Request body must content either 'title', 'style' or 'content'`
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

module.exports = ProfilesRouter