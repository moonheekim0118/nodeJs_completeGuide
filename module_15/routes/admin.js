const express = require('express');
const route = express.Router();
const adminController = require('../controllers/admin');
const isAuth= require('../middleware/is-auth');
const {  body } = require('express-validator/check'); // check function 

route.get('/products',isAuth, adminController.getProducts); 

 //admin/add-product == > GET
route.get('/add-product', isAuth,adminController.getAddProduct);

// /adimin/add-product ==> POST 
route.post('/add-product',isAuth, [
    body('title').trim().isLength({min:3, max:10}).withMessage('title of your product must be 3~10'),
    body('imageUrl').trim().isURL().withMessage('image must be url'),
    body('price').trim().isNumeric().withMessage('price must be numbers'),
    body('description').isLength({min: 10, max:100}).withMessage('description of your product must be 10~100')
]
,adminController.postAddProduct)

route.get('/edit-product/:productId', isAuth,adminController.getEditProducts);

// edit-product에서 button 눌러서 post되고, 이에 따라 정보 변경 edit 
route.post('/edit-product', isAuth,[
    body('title').trim().isLength({min:3, max:10}).withMessage('title of your product must be 3~10'),
    body('imageUrl').trim().isURL().withMessage('image must be url'),
    body('price').trim().isNumeric().withMessage('price must be numbers'),
    body('description').isLength({min: 10, max:100}).withMessage('description of your product must be 10~100')
],adminController.postEditProduct);

route.post('/delete-product', isAuth,adminController.postDeleteProduct);

module.exports=route;