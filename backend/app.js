const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const HttpError = require('./models/http-error')
const placesRoutes = require('./routes/places-routes')
const userRoutes = require('./routes/users-routes')

require('dotenv').config()

const app = express()

app.use(bodyParser.json())

app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:3000']
    const origin = req.headers.origin
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin)
    }

    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')

    next()
})

app.use('/api/places', placesRoutes)
app.use('/api/users', userRoutes)

// Handle unrecognized routes
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404)
    return next(error)
})

// Error handling middleware. executed only if any middleware before it yields an error
app.use((error, req, res, next) => {
    // check and remove if multer added a req.file
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err)
        })
    }

    if (res.headerSent) {
        return next(error)
    }

    res.status(error.code || 500).json({
        message: error.message || 'An unknown error occurred!'
    })
})

mongoose
    .connect(
        `mongodb+srv://jhossain:${process.env.MONGODB_PASSWORD}@cluster0.4rpp0.mongodb.net/mern?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(5000, () => console.log('Listening on port 5000'))
    })
    .catch((err) => {
        console.log(err)
    })
