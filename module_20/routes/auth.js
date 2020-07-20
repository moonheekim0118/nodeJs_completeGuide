const authController = require('../Controllers/auth');
const express =require('express');
const bcrypt = require('bcryptjs');
const router =express.Router();
const User = require('../Models/user');
const { body } = require('express-validator/check');

router.get('/login', authController.getLogin);

router.post('/login', 
[ // 현재 코드는 User 괜히 3번 findOne하는거라서 비효율적이다.
    // 나중에 더 효율적으로 짜보자 
    body('email').isEmail().withMessage('email을 입력해주세요') // email 형태 아닐 경우 
    ,
    body('password').isLength({min:6, max:12}).withMessage('비밀번호를 잘못 입력하셨습니다.') // 비밀번호 length 벗어날 경우 
],authController.postLogin);


router.get('/signUp', authController.getSignUp);

router.post('/signUp', [
    body('email').isEmail().withMessage('올바른 email을 입력해주세요')
    .custom((value, {req})=>{
        return User.findOne({email:value})
        .then(user=>{
            if(user){
               return Promise.reject('이미 존재하는 이메일 입니다.'); 
            };
        }).catch(err=>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    }).normalizeEmail(),
    
    body('password').trim().isAlphanumeric().withMessage('비밀번호는 숫자와 문자로만 생성가능합니다.')
    .isLength({min:6, max:12}).withMessage('비밀번호는 최소 6자 최대 12자 입니다.'),
    body('confirmPassword').custom((value,{req})=>{
        if(value !== req.body.password){
           throw new Error('비밀번호가 일치하지 않습니다.');
        // return Promise.reject('비밀번호가 일치하지 않습니다.')
        }
        else return true;
    }).trim()
],authController.postSignUp);

router.get('/Logout',authController.getLogout);

router.get('/new-password/:token', authController.getResetPage); // reset 입력 페이지 

router.post('/resetPassword', authController.postResetPage); // reset 

router.get('/new-password',authController.getNewPassword); // reset 할것인지 물어보는 페이지로

router.post('/new-password',authController.postNewPassword); // 이메일 발송 

module.exports=router;