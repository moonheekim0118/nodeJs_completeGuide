const express = require('express');
const route = express.Router();
const adminController = require('../controllers/admin');


route.get('/products', adminController.getProducts); 

 //admin/add-product == > GET
route.get('/add-product',adminController.getAddProduct);

// /adimin/add-product ==> POST 
route.post('/add-product',adminController.postAddProduct);

route.get('/edit-product/:productId',adminController.getEditProducts);

// edit-product에서 button 눌러서 post되고, 이에 따라 정보 변경 edit 
route.post('/edit-product', adminController.postEditProduct);

route.post('/delete-product', adminController.postDeleteProduct);

module.exports=route;