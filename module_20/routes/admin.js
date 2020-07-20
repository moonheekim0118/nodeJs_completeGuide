const express =require('express');
const router =express.Router();
const AdminController= require('../Controllers/admin');
const AuthRouting = require('../middleware/is-Auth');
const { body } = require('express-validator/check');
// /admin 으로 시작하는 path 처리

router.get('/products', AuthRouting, AdminController.getProducts);

router.get('/add-product', AuthRouting, AdminController.getAddProduct);

router.post('/add-product', AuthRouting,[
body('title').isString().withMessage('제목을 올바르게 입력해주세요.')
.isLength({min:2,max:15}).withMessage('제목은 2글자 이상, 15글자 이하여야 합니다.').trim()
// body('imageUrl').isURL().withMessage('올바른 형식의 이미지 주소를 입력해주세요.').trim()
,
body('price').isNumeric().withMessage('숫자만 입력해주세요')
,
body('description').isLength({min:5, max:100}).withMessage('상품 설명은 최소 5글자여야합니다.')
] ,
AdminController.postAddProduct);

router.get('/edit-product/:productId', AuthRouting, AdminController.getEditProduct);

router.post('/edit-product',  AuthRouting,
[
body('title').isString().withMessage('제목을 올바르게 입력해주세요.')
.isLength({min:2,max:15}).withMessage('제목은 2글자 이상, 15글자 이하여야 합니다.').trim()
,
body('price').isNumeric().withMessage('숫자만 입력해주세요')
,
body('description').isLength({min:5, max:100}).withMessage('상품 설명은 최소 5글자여야합니다.')
] ,
AdminController.postEditProduct);

router.post('/delete-product', AuthRouting,AdminController.postDeleteProduct);

module.exports=router;