const path = require('path')
const express = require('express')
const MethodsService = require('./methods-service')
//no auth needed for standard app data

const MethodsRouter = express.Router()
const jsonParser = express.json()

const serializeMethod = method => ({
  id: method.method_id,
  method: method.method_options,
  fasting: method.fasting_length,
  feast: method.feast_length,
})

//route to retrieve all fasting methods
MethodsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    MethodsService.getAllFastingMethods(knexInstance)
      .then(methods => {
        //console.log(methods, 'nope');
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

module.exports = MethodsRouter