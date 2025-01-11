const express = require('express')
const { addToCart, fatchCartByUser, deleteFormCart, updateCart } = require('../controller/Cart')

const router = express.Router()
// /products is already in base path
router.post('/', addToCart)
      .get('/',fatchCartByUser)
      .delete('/:id',deleteFormCart)
      .patch('/:id',updateCart)
exports.router=router