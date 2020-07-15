const User= require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:'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'
    }
}));
exports.getLogin=(req,res,next)=>
{
    console.log(req.session);
    res.render('auth/login', {
        path:'/login',
        pageTitle:'login',
        ErrorMessage: req.flash('err')
    });
}

exports.postLogin = (req, res, next) => {
    const email=req.body.email;
    const password=req.body.password;
    User.findOne({email:email})
    .then(user=>{
        if(!user) {
            req.flash('err', 'invalid email');
            return res.redirect('/login');}
        bcrypt.compare(password, user.password)
        .then(doMatch=>{
            if(!doMatch){
                req.flash('err', 'invalid password');
                res.redirect('/login');
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
    .catch(err=>console.log(err));
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
    ErrorMessage: req.flash('err')
    });
}

exports.postSignUp=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    const confirmPassword=req.body.confirmPassword;
    User.findOne({email:email})
    .then(userDoc=>{
        if(userDoc) 
        { 
            req.flash('err', 'email already taken!');
            return res.redirect('/signup'); }
        else{
        return bcrypt.hash(password,12)
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
            return transporter.sendMail({
                to: email,
                from: 'moonhee118118@gmail.com',
                subject:'Welcome to our shop!',
                html: '<h1>you successfully signed up!</h1>'
            });
        }).catch(err=>console.log(err));
    }
    })
    .catch(err=>console.log(err));
}

exports.getReset = (req,res,next) => {
    res.render('auth/reset', {
        path:'/reset',
        pageTitle: 'reset password',
        ErrorMessage: req.flash('err')
    });

}

exports.postReset = (req,res,next)=>{
    crypto.randomBytes(32, (err, Buffer)=>{
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
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        })
        .then(result=>{
            res.redirect('/');
            return transporter.sendMail({
                to: req.body.email,
                from: 'moonhee118118@gmail.com',
                subject:'password reset',
                html: `
                <p>you requested a password reset</p>
                <p> click this <a href="https://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                `
            })
        }).then(reuslt=>{ 
            console.log(reuslt);
        }).catch(err=>console.log(err));
    })
};