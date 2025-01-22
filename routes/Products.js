const express = require('express')
const { createProduct, fetchAllProducts, fetchProductById, updateProduct } = require('../controller/Products')
const { Product } = require('../model/Product')

const router = express.Router()
// /products is already in base path
router.post('/', createProduct)
      .get('/',fetchAllProducts)
      .get('/:id',fetchProductById)
      .patch('/:id',updateProduct)
      // .get('update/test',async(req,res)=>{
      //       //for adding discountPrice to existing data:delete this code after use
      //       const products = await Product.find({})
      //       for(let product of products){
      //             product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
      //             await product.save()
      //             console.log(product.title+'updated');
                  
      //       }
      //       res.send('ok')
      // })
exports.router=router