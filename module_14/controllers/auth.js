const User= require('../models/user');

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