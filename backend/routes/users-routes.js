const express = require('express')
const { check } = require('express-validator')

const usersControllers = require('../controllers/users-controllers')
const fileUpload = require('../middleware/file-upload')

const router = express.Router()

// retrieve place by place id
router.get('/', usersControllers.getUsers)

// sign up user
router.post(
    '/signup',
    fileUpload.single('image'),
    [
        check('name').notEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 6 })
    ],
    usersControllers.signup
)

// login user
router.post('/login', usersControllers.login)

module.exports = router
