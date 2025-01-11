const express = require('express')
const { fatchUserById, updateUser } = require('../controller/User')

const router = express.Router()
// /user is already in base path
router.get('/own',fatchUserById)
      .patch('/:id',updateUser)
exports.router=router