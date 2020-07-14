const User= require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin=(req,res,next)=>
{
    console.log(req.session);
    res.render('auth/login', {
        path:'/login',
        pageTitle:'login',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postLogin = (req, res, next) => {
    const email=req.body.email;
    const password=req.body.password;
    User.findOne({email:email})
    .then(user=>{
        if(!user) return res.redirect('/login');
        bcrypt.compare(password, user.password)
        .then(doMatch=>{
            if(!doMatch){
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
    isAuthenticated: req.session.isLoggedIn1});
}

exports.postSignUp=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    const confirmPassword=req.body.confirmPassword;
    User.findOne({email:email})
    .then(userDoc=>{
        if(userDoc) 
        { return res.redirect('/signup'); }
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
        })}
    })
    .catch(err=>console.log(err));
}