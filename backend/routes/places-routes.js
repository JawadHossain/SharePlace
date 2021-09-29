const express = require('express')
const { check } = require('express-validator')

const placesControllers = require('../controllers/places-controllers')

const router = express.Router()

// retrieve place by place id
router.get('/:pid', placesControllers.getPlaceById)

// retrieve places by user id
router.get('/user/:uid', placesControllers.getPlacesByUserId)

// create a new place
router.post(
    '/',
    [
        check('title').notEmpty(),
        check('description').isLength({ min: 5 }),
        check('address').notEmpty()
    ],
    placesControllers.createPlace
)

// update a place
router.patch(
    '/:pid',
    [check('title').notEmpty(), check('description').isLength({ min: 5 })],
    placesControllers.updatePlace
)

// delete a place
router.delete('/:pid', placesControllers.deletePlace)

module.exports = router
