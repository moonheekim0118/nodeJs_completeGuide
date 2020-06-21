const express = require('express');
const route = express.Router();
const productsController = require('../controllers/products');

route.get('/add-product',productsController.getAddProduct);

route.post('/add-product',productsController.postAddProduct);


module.exports=route;