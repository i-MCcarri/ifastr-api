require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
//const authRouter = require('./auth/auth-router');
const MethodsRouter = require('./methods/methods-router')
const ProfilesRouter = require('./profile/profile-router')
const TrackerRouter = require('./tracker/tracker-router')

const app = express()

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(express.json());
app.use(morgan(morganOption));
app.use(cors())
app.use(helmet())

//mount middleware.
//app.use('/auth', authRouter)
app.use('/fasting_methods', MethodsRouter)
app.use('/users', ProfilesRouter)
app.use('/fasting_tracker', TrackerRouter)

app.get('/', (req, res) => {
  res.send('Hello, User!')
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: 'Server error' }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app