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

exports.postLogin=(req,res,next)=>
{
    //user 정보 Session에 저장 
    User.findById("5f0519efbe41f10860a1bac0")
    .then(user=>{
        req.session.isLoggedIn = true;
        req.session.user=user;
         // session이 제대로 create되고 redirect 하도록 확실히함!
         // 특히나 redirect는 session이 생성되기 전에 실행되는 경우가 있음
        req.session.save(err=>{
            console.log(err);
            res.redirect('/');
        });
    }).catch(err=>console.log(err));
}


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