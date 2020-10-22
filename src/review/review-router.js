const path = require('path')
const express = require('express')
const SuccessfulIFService = require('../successful-if/succesful-if-service')
//require Auth definition const {auth} = require('./')

const reviewsRouter = express.Router()
const jsonParser = express.json()

//Route for review of ifastr table: tracker
reviewsRouter
  .route('/)
  //require auth for login user data review
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    SuccessfulIFService.getAllSuccessfulIF(knexInstance)
      .then(reviews => {
        res.json(reviews.map(serializeReviews))
      })
      .catch(next)
  }),
  //no post needed for review of fasting data in tracker table

reviewsRouter
  .route('/tracker/:fasting_id')
  //require authorization 
  .all((req, res, next) => {
    //verifies if fast exists in tracker table to review
    SuccessfulIFService.getById(
      req.app.get('db'),
      req.params.fasting_id
    )
      .then(review => {
        if (!review) {
          return res.status(404).json({
            error: { message: `Fast doesn't exist for review.` }
          })
        }
        res.review = review
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeReviews(res.review))
  })
  //no update or delete needed to review completed fasting data

module.exports = reviewsRouter