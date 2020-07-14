const express= require('express');
const route = express.Router();
const shopController = require('../controllers/shop');
const isAuth= require('../middleware/is-auth');

route.get('/',shopController.getIndex);

route.get('/products/:productId',shopController.getProduct);

route.get('/products',shopController.getProducts);

route.post('/cart',isAuth, shopController.postCart);

route.get('/cart',isAuth, shopController.getCart);

route.post('/cart-delete-item',isAuth,  shopController.postDeleteCart);

route.get('/orders', isAuth, shopController.getOrders);

route.post('/create-order', isAuth, shopController.postCreateOrder);

/*


// route.get('/checkout',shopController.getCheckout);

route.get('/orders', shopController.getOrders);
route.post('/cart-edit-item', shopController.postEditCart);


*/
module.exports=route;
