const express = require('express')
const bodyParser = require('body-parser')

const HttpError = require('./models/http-error')
const placesRoutes = require('./routes/places-routes')
const userRoutes = require('./routes/users-routes')

const app = express()

app.use(bodyParser.json())

app.use('/api/places', placesRoutes)
app.use('/api/users', userRoutes)

// Handle unrecognized routes
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404)
    return next(error)
})

// Error handling middleware. executed only if any middleware before it yields an error
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }

    res.status(error.code || 500).json({
        message: error.message || 'An unknown error occurred!'
    })
})

app.listen(5000)
