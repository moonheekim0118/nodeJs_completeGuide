const express= require('express');
const route = express.Router();
const shopController = require('../controllers/shop');


route.get('/',shopController.getIndex);

route.get('/products',shopController.getProducts);

route.get('/cart',shopController.getCart);

route.get('/checkout',shopController.getCheckout);


module.exports=route;
