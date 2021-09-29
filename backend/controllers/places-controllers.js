const { validationResult } = require('express-validator')
const { v4: uuid } = require('uuid')

const HttpError = require('../models/http-error')

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrappers in the world!',
        imageUrl:
            'https://lh5.googleusercontent.com/p/AF1QipMiSG7PcNNLBrS5W6DRtDASsxhaPnnnsYQU0mwj=w408-h291-k-no',
        address: '20 W 34th St, New York, NY 10001, United States',
        location: {
            lat: 40.7484405,
            lng: -73.9856644
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Emp. State Building',
        description: 'One of the most famous sky scrappers in the world!',
        imageUrl:
            'https://lh5.googleusercontent.com/p/AF1QipMiSG7PcNNLBrS5W6DRtDASsxhaPnnnsYQU0mwj=w408-h291-k-no',
        address: '20 W 34th St, New York, NY 10001, United States',
        location: {
            lat: 40.7484405,
            lng: -73.9856644
        },
        creator: 'u2'
    }
]

// retrieve place by place id
const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid

    const place = DUMMY_PLACES.find((p) => p.id === placeId)

    if (!place) {
        const error = new HttpError(
            'Could not find a place with the provided place id.',
            404
        )
        return next(error)
    }

    res.json({ place }) // => { place } => { place: place }
}

// retrieve places by user id
const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid

    const places = DUMMY_PLACES.filter((p) => p.creator === userId)

    if (!places || places.length === 0) {
        const error = new HttpError(
            'Could not find a place with the provided user id.',
            404
        )
        return next(error)
    }

    res.json({ places })
}

// create a new place
const createPlace = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpError(
            'Invalid inputs passed, please check your data',
            422
        )
    }

    const { title, description, coordinates, address, creator } = req.body

    const createdPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        address,
        creator
    }

    DUMMY_PLACES.push(createdPlace)

    res.status(201).json({ place: createdPlace })
}

// update a place
const updatePlace = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpError(
            'Invalid inputs passed, please check your data',
            422
        )
    }

    const placeId = req.params.pid

    // only allow title and description
    const { title, description } = req.body

    const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) }
    const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId)
    updatedPlace.title = title
    updatedPlace.description = description

    DUMMY_PLACES[placeIndex] = updatedPlace

    res.status(200).json({ place: updatedPlace })
}

// delete a place
const deletePlace = (req, res, next) => {
    const placeId = req.params.pid

    if (!DUMMY_PLACES.find((p) => p.id !== placeId)) {
        throw new HttpError('Could not find a place with that id.', 404)
    }

    DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId)

    res.status(200).json({ message: 'Deleted place.' })
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace
