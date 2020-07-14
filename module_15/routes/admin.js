const express = require('express');
const route = express.Router();
const adminController = require('../controllers/admin');
const isAuth= require('../middleware/is-auth');

route.get('/products',isAuth, adminController.getProducts); 

 //admin/add-product == > GET
route.get('/add-product', isAuth,adminController.getAddProduct);

// /adimin/add-product ==> POST 
route.post('/add-product', isAuth,adminController.postAddProduct);

route.get('/edit-product/:productId', isAuth,adminController.getEditProducts);

// edit-product에서 button 눌러서 post되고, 이에 따라 정보 변경 edit 
route.post('/edit-product', isAuth,adminController.postEditProduct);

route.post('/delete-product', isAuth,adminController.postDeleteProduct);

module.exports=route;