const path = require('path')
const express = require('express')
const MethodsService = require('./methods-service')
//no auth needed for standard app data

const MethodsRouter = express.Router()
const jsonParser = express.json()

const serializeMethod = method => ({
  id: method.id,
  method: method.method,
  fasting: method.fasting,
  feast: method.feast,
})

//route to retrieve all fasting methods
MethodsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    MethodsService.getAllFastingMethods(knexInstance)
      .then(methods => {
        // res.json(methods.map(serializemethod))
        res.json(methods)
      })
      .catch(next)
  })
  //post method to users table 
  .post(jsonParser, (req, res, next) => {
    const { id} = req.body
    const newmethod = { id }

    for (const [key, value] of Object.entries(newmethod))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    MethodsService.insertMethod(
      req.app.get('db'),
      newmethod
    )
      .then(method => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${method.id}`))
          .json(serializemethod(method))
      })
      .catch(next)
  })

MethodsRouter
  .route('/:method_id')
  .all((req, res, next) => {
    MethodsService.getById(
      req.app.get('db'),
      req.params.method_id
    )
      .then(method => {
        if (!method) {
          return res.status(404).json({
            error: { message: `method doesn't exist` }
          })
        }
        res.method = method
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializemethod(res.method))
  })
  //no delete needed table data does not change
  //update user selected fasting method
  .patch(jsonParser, (req, res, next) => {
    const { method, fasting, feast } = req.body
    const methodToUpdate = { method, fasting, feast }

    const numberOfValues = Object.values(methodToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'method', 'feast' or 'fasting'`
        }
      })

    MethodsService.updatemethod(
      req.app.get('db'),
      req.params.method_id,
      methodToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = MethodsRouter