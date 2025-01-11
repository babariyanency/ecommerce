const express = require('express')
const { createOrder, fatchOrdersByUser, deleteOrder, updateOrder, fetchAllOrders } = require('../controller/Order')

const router = express.Router()
// /order is already in base path
router.post('/', createOrder)
      .get('/own/',fatchOrdersByUser)
      .delete('/:id',deleteOrder)
      .patch('/:id',updateOrder)
      .get('/',fetchAllOrders)
exports.router=router