const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/session')
const UserController = require('../app/controllers/users')
const Validator = require('../app/validators/user')

//Login/logout
routes.get('/login', SessionController.loginForm)
// routes.post('/login', SessionController.login)
routes.post('/logout', SessionController.logout)

// // forgot password / reset password
// routes.get('/forgot-password', SessionController.forgotForm)
// routes.get('/password-reset', SessionController.resetForm)
// routes.pos('/forgot-password', SessionController.forgot)
// routes.pos('/password-reset', SessionController.reset)

// // user register UserController
routes.get('/register', UserController.create)
routes.post('/register', Validator.post, UserController.post)
routes.get("/:index/editar", Validator.edit, UserController.edit)

routes.get('/', UserController.show)
routes.put('/', Validator.update, UserController.update)
// routes.delete('/', UserController.delete)

module.exports = routes