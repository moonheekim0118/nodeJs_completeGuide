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
        req.session.user=user;
        res.redirect('/');
    }).catch(err=>console.log(err));
}
