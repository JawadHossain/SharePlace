const { validationResult } = require('express-validator')
const { v4: uuid } = require('uuid')

const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')

const Place = require('../models/place')

// retrieve place by place id
const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid
    let place

    try {
        place = await Place.findById(placeId)
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, couldn not find a place.',
            500
        )
        return next(error)
    }

    if (!place) {
        const error = new HttpError(
            'Could not find a place with the provided place id.',
            404
        )
        return next(error)
    }

    res.json({ place: place.toObject({ getters: true }) })
}

// retrieve places by user id
const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid
    let place

    try {
        places = await Place.find({ creator: userId })
    } catch (err) {
        const error = new HttpError(
            'Fetching places failed, please try again later.',
            500
        )
        return next(error)
    }

    if (!places || places.length === 0) {
        const error = new HttpError(
            'Could not find a place with the provided user id.',
            404
        )
        return next(error)
    }

    res.json({
        places: places.map((place) => place.toObject({ getters: true }))
    })
}

// create a new place
const createPlace = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data', 422)
        )
    }

    const { title, description, address, creator } = req.body

    let coordinates
    try {
        coordinates = await getCoordsForAddress(address)
    } catch (error) {
        return next(error)
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/250px-Empire_State_Building_%28aerial_view%29.jpg',
        creator
    })

    try {
        await createdPlace.save()
    } catch (err) {
        const error = new HttpError(
            'Creating place failed, plese try again',
            500
        )
        return next(error)
    }

    res.status(201).json({ place: createdPlace })
}

// update a place
const updatePlace = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data', 422)
        )
    }

    const placeId = req.params.pid

    // only allow title and description
    const { title, description } = req.body

    let place

    try {
        place = await Place.findById(placeId)
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a place.',
            500
        )
        return next(error)
    }

    place.title = title
    place.description = description

    try {
        await place.save()
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update place.',
            500
        )
        return next(error)
    }

    res.status(200).json({ place: place.toObject({ getters: true }) })
}

// delete a place
const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid

    let place

    try {
        place = await Place.findById(placeId)
        await place.remove()
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete place.',
            500
        )
        return next(error)
    }

    res.status(200).json({ message: 'Deleted place.' })
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace
