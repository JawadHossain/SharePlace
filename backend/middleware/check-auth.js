const HttpError = require('../models/http-error')
const jwt = require('jsonwebtoken')

/**
 * Validate Authorization Token
 * @param {request} req
 * @param {result} res
 * @param {next} next
 * @returns next()
 */
module.exports = (req, res, next) => {
    // For some methods other than GET, browsers might send an OPTIONS request to verify if the method is allowed
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1] // Authorizatoin: 'Bearer TOKEN'
        if (!token) {
            throw new Error()
        }

        const decodedToken = jwt.verify(token, process.env.JWT_KEY)

        // add user token data to req
        req.userData = { userId: decodedToken.userId }
        next()
    } catch (err) {
        const error = new HttpError('Authentication failed!', 403)
        return next(console.error)
    }
}
