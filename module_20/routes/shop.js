const express =require('express');
const router =express.Router();
const shopController = require('../Controllers/shop');
const isAuth = require('../middleware/is-Auth');

router.get('/', shopController.getIndex);

router.get('/products/:productId',shopController.getProductDetail); //product detail page 

router.get('/products', shopController.getProducts);

router.get('/cart',shopController.getCart);

router.post('/cart',shopController.postAddToCart);

router.get('/orders/:invoiceId', isAuth, shopController.getInvoice);

router.get('/orders',isAuth,shopController.getOrder);

router.post('/create-order',shopController.postAddToOrder);

router.post('/cart-delete-item',shopController.postDeleteCart);

router.post('/order-delete-item',shopController.postDeleteOrder);

module.exports=router;