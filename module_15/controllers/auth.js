const User= require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const user = require('../models/user');
const {validationResult} = require('express-validator/check');

const sendMail = async (to, subject, html) => {
    const googleTransport = await nodemailer.createTransport({
        host:  'smtp.gmail.com',
        port: 465,
        secure: true,
        auth:{
            type:'OAuth2',
            user: 'moonhee118118@gmail.com',
            clientId:'547961950939-6vaj82eavp76s6o4vdknbqupuhnm3m7s.apps.googleusercontent.com',
            clientSecret:'547961950939-6vaj82eavp76s6o4vdknbqupuhnm3m7s.apps.googleusercontent.com',
            refreshToken: '1//04lIqFD9LqZ4vCgYIARAAGAQSNwF-L9IrsvkIsbPq1XsZXyHXhtlqRIDJPdEXN7nCVKc54zziHk_WQ2uM5ShdyAO6J_LrQAvLypo',
            accessToken: 'ya29.a0AfH6SMDIqFPx2oRlkyhy3Ke_BCu_OlevjoKZiavwQxsI3H-izIyjZzMz0hnODD1uHrr9csPOhbVZFQbUqb0Sc01PLczo8UciptUMzOXo5yh-d2k_VnrN-ynCB3cAimqYu-ArhTC5QSapKO_L28rgR6wKz6E4K212AhE',
            expirse: 3600
        }
    }),
    mailOptions = {
        from: 'Owner <moonhee118118@gmail.com>',
        to,
        subject,
        html
    }
    try{
        await googleTransport.sendMail(mailOptions);
        googleTransport.close();
        console.log(`mail have sent to ${ to }`);
    } catch(err){
        console.log(err);
    }
}

exports.getLogin=(req,res,next)=>
{
    console.log(req.session);
    res.render('auth/login', {
        path:'/login',
        pageTitle:'login',
        ErrorMessage: req.flash('err'),
        oldInput: { email:"", password:""},
        validationError:[]
    });
}

exports.postLogin = (req, res, next) => {
    const email=req.body.email;
    const password=req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('auth/login',
        { path:'/login',
        pageTitle:'login',
        ErrorMessage: errors.array()[0].msg,
        oldInput: {email: email, password:password},
        validationError: errors.array()
        });
    }
    User.findOne({email:email})
    .then(user=>{
        bcrypt.compare(password, user.password)
        .then(doMatch=>{
            if(!doMatch){
                return res.status(422).render('auth/login',
                { path:'/login',
                pageTitle:'login',
                ErrorMessage: 'invalid password',
                oldInput: {email: email, password:password},
                validationError: []
                });
            }
            else{
                req.session.isLoggedIn=true;
                req.session.user=user;
                return req.session.save(err=>{
                    console.log(err);
                    res.redirect('/');
                });
            }
        })
        .catch(err=>{
            console.log(err)
        });
    })
    .catch(err => {
        const error = new Error(err);
         error.httpStatusCode = 500;
        return next(error);
    });
  };


exports.postLogout=(req,res,next)=>{
    //clear session
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect('/');
    });
}

exports.getSignUp=(req,res,next)=>{
    res.render('auth/signup',
    { path:'/signup',
    pageTitle:'signup',
    ErrorMessage: req.flash('err'),
    oldInput:{email:'', password:''},
    validationError:[]
    });
}

exports.postSignUp=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    const confirmPassword=req.body.confirmPassword;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('auth/signup',
        { path:'/signup',
        pageTitle:'signup',
        ErrorMessage: errors.array()[0].msg,
        oldInput:{email: email, password:password},
        validationError : errors.array()
        });
    }
    bcrypt.hash(password,12)
        .then(hashedPassword=>{
            const user = new User({
                email:email,
                password:hashedPassword,
                cart:{items:[]}
            });
            return user.save();
        })
        .then(result=>{
            res.redirect('/login');
        //    return sendMail(email, 'Welcome to our shop!', '<p>hi!</p>');
        }) .catch(err => {
            const error = new Error(err);
             error.httpStatusCode = 500;
            return next(error);
        });

}

exports.getReset = (req,res,next) => {
    res.render('auth/reset', {
        path:'/reset',
        pageTitle: 'reset password',
        ErrorMessage: req.flash('err')
    });

}

exports.postReset = (req,res,next)=>{
    crypto.randomBytes(32, (err, Buffer)=>{ // 토큰 생성하기 
        if(err){
            console.log(err);
            return res.redirect('/reset');
        }
        const token = Buffer.toString('hex');
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                req.flash('err', 'no account with that email found');
                return res.redirect('/reset');
            }
            user.resetToken = token;  // 유저 토큰 저장 
            user.resetTokenExpiration = Date.now() + 3600000; // 토큰 만기일 저장 
            return user.save();
        })
        .then(result=>{
            res.redirect('/');
            return sendMail(req.body.email, 'please reset your password' , `
            <p>you requested a password reset</p>
            <p> click this <a href="http://localhost:3000/new-password/${token}">link</a> to set a new password.</p>
            `);
        }).then(reuslt=>{  // https 로 연결하면 오류가 뜬다.
            console.log(reuslt);
        }) .catch(err => {
            const error = new Error(err);
             error.httpStatusCode = 500;
            return next(error);
        });
    })
};


exports.getUpdatePassword = (req,res,next)=>{ // token으로 연결된 페이지 reseting new password 
    const token = req.params.token; // 파라미터에서 토큰 가져오기 
    User.findOne({resetToken:token, resetTokenExpiration:{$gt: Date.now()}}) // 해당 토큰과 일치하는 User 찾기,
    // 토큰이 아직도 유효한지 체크 
    .then(user=>{
        res.render('auth/new-password', {
            path:'/new_password',
            pageTitle: 'reset your password',
            ErrorMessage: req.flash('err'),
            userId: user._id.toString(),
            passwordToken: token
        });
    })
    .catch(err => {
        const error = new Error(err);
         error.httpStatusCode = 500;
        return next(error);
    });
}

exports.postUpdatePassword = (req,res,next) =>{
    const userId = req.body.userId;
    const newPassword= req.body.password;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({resetToken:passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id:userId})
    .then(user=>{
        resetUser=user;
        return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword=>{
        resetUser.password=hashedPassword;
        resetUser.resetToken=undefined;
        resetUser.resetTokenExpiration=undefined;
        return resetUser.save();
    })
    .then(result=>{
        res.redirect('/login');
    })
    .catch(err => {
        const error = new Error(err);
         error.httpStatusCode = 500;
        return next(error);
    });
    // 새로 입력된 password가져오기
    // hashed 값으로 user id에 해당하는 user에게 넣어주기

}