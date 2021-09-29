const { validationResult } = require('express-validator')
const { v4: uuid } = require('uuid')

const HttpError = require('../models/http-error')

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Max Schwarz',
        email: 'test@test.com',
        password: 'testers'
    }
]

// get all users
const getUsers = (req, res, next) => {
    res.json(DUMMY_USERS)
}

// sign up user
const signup = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpError(
            'Invalid inputs passed, please check your data',
            422
        )
    }

    const { name, email, password } = req.body

    const emailExists = DUMMY_USERS.find((u) => u.email === email)
    if (emailExists) {
        throw new HttpError(
            'Could not create user, email already exists.',
            422 // invalid user input
        )
    }

    const createdUser = {
        id: uuid(),
        name,
        email,
        password
    }

    DUMMY_USERS.push(createdUser)

    res.status(201).json({ user: createdUser })
}

// login user
const login = (req, res, next) => {
    const { email, password } = req.body

    const identifiedUser = DUMMY_USERS.find((u) => u.email === email)

    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError(
            'Could not identify user, credentials seem to be wrong.',
            401
        )
    }

    res.json({ message: 'Logged in!' })
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login
