const express = require('express')
// const {  createUser } = require('../controller/User')
const { loginUser, checkAuth, createUser, resetPasswordRequest, resetPassword, logout } = require('../controller/Auth')
const passport = require('passport')

const router = express.Router()
// /auth is already in base path
router.post('/signup',createUser)
    .post('/login', passport.authenticate('local'), loginUser)
    .get('/logout',logout)
    .get('/check',passport.authenticate('jwt'),checkAuth)
    .post('/reset-password-request', resetPasswordRequest)
    .post('/reset-password', resetPassword)
exports.router=router