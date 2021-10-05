const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const User = require('../models/user')

// get all users
const getUsers = async (req, res, next) => {
    let users
    try {
        users = await User.find({}, '-password')
    } catch (err) {
        const error = new HttpError(
            'Fetching users failed, please try again later',
            500
        )
        return next(error)
    }

    res.json({ users: users.map((user) => user.toObject({ getters: true })) })
}

// sign up user
const signup = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data', 422)
        )
    }

    const { name, email, password } = req.body

    // check if email exists
    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError('Sign up failed, please try again', 500)
        return next(error)
    }

    if (existingUser) {
        const error = new HttpError('User exists already, please log in', 422)
        return next(error)
    }

    const createdUser = new User({
        name,
        email,
        image: 'https://media-exp1.licdn.com/dms/image/C5603AQGpDsnURi2Ldg/profile-displayphoto-shrink_800_800/0/1620231306558?e=1639008000&v=beta&t=pEaZn1lr3nwlg82muOZABBU2cvsMcohcDIQ0d1RLDCE',
        password,
        places: []
    })

    try {
        await createdUser.save()
    } catch (err) {
        const error = new HttpError('Sign Up failed, plese try again', 500)
        return next(error)
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) })
}

// login user
const login = async (req, res, next) => {
    const { email, password } = req.body

    // check if email exists
    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError('Login failed, please try again', 500)
        return next(error)
    }

    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            401
        )
        return next(error)
    }

    res.json({
        message: 'Logged in!',
        user: existingUser.toObject({ getters: true })
    })
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login
