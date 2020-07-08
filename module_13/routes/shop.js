const express= require('express');
const route = express.Router();
const shopController = require('../controllers/shop');

route.get('/',shopController.getIndex);

route.get('/products/:productId',shopController.getProduct);

route.get('/products',shopController.getProducts);



/*

route.get('/cart',shopController.getCart);

route.post('/cart',shopController.postCart);

// route.get('/checkout',shopController.getCheckout);

route.get('/orders', shopController.getOrders);

route.post('/cart-delete-item', shopController.postDeleteCart);

//route.post('/cart-edit-item', shopController.postEditCart);

route.post('/create-order', shopController.postCreateOrder);
*/
module.exports=route;
