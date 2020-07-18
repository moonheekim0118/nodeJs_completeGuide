const express= require('express');
const route = express.Router();
const authController = require('../controllers/auth');
const User = require('../models/user');
const {  body } = require('express-validator/check'); // check function 

route.get('/login', authController.getLogin);

route.post('/login',
[
    body('email')
    .isEmail().withMessage('Please Enter a valid email')
    .custom((value, {req})=>{
        return User.findOne({email:value})
        .then(userDoc=>{
            if(!userDoc){
                return Promise.reject('Email is wrong');
            };
        });
    })
    .normalizeEmail() 
    ,
    body('password')
    .isLength({min:6, max:12}).withMessage('Password length should be 6~12')
    .isAlphanumeric().withMessage('only numbers and characters are allowed')
    .trim()
]
,authController.postLogin);

route.post('/logout', authController.postLogout);


route.get('/signUp',authController.getSignUp);
route.post('/signUp',
[body('email')
.isEmail().withMessage('Please Enter a valid email')
.custom((value, {req})=>{
    return User.findOne({email:value})
    .then(userDoc=>{
        if(userDoc) 
        { 
            return Promise.reject('Email exists already. please pick another one')
        };
    });
})
.normalizeEmail()
,
body('password')
.isLength({min:6, max:12}).withMessage('Password length should be 6~12')
.isAlphanumeric().withMessage('only numbers and characters are allowed')
.trim()
,
body('confirmPassword').custom((value, {req})=>{
    if (value!==req.body.password){
        throw new Error('Password have to match!');
    }
    return true;
}
)
.trim()
]
,authController.postSignUp);


route.get('/reset',authController.getReset);
route.post('/reset',authController.postReset);

route.get('/new-password/:token', authController.getUpdatePassword);
route.post('/new-password', authController.postUpdatePassword);
module.exports=route;