const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

    const { name, email, password, file } = req.body

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

    let hashedPassword
    // hash password
    try {
        hashedPassword = await bcrypt.hash(password, 12)
    } catch (err) {
        const error = new HttpError(
            'Could not create user, please try again.',
            500
        )
        return next(error)
    }

    const createdUser = new User({
        name,
        email,
        image: req.file.path,
        password: hashedPassword,
        places: []
    })

    let token
    try {
        await createdUser.save()

        // generate token
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        )
    } catch (err) {
        const error = new HttpError('Sign Up failed, plese try again', 500)
        return next(error)
    }

    res.status(201).json({
        userId: createdUser.id,
        email: createdUser.email,
        token: token
    })
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

    // check password
    let isValidPassword = false
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch (err) {
        const error = new HttpError(
            'Could not log you in, please check you credentials and try again',
            500
        )
        return next(error)
    }

    // raise error if invalid credentials
    if (!existingUser || !isValidPassword) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            403
        )
        return next(error)
    }

    let token
    // generate token
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        )
    } catch (err) {
        const error = new HttpError('Log in failed, plese try again', 500)
        return next(error)
    }

    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token
    })
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login
