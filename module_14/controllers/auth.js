exports.getLogin=(req,res,next)=>
{
    console.log(req.session);
    res.render('auth/login', {
        path:'/login',
        pageTitle:'login',
        isAuthenticated: false
    });
}

exports.postLogin=(req,res,next)=>
{
    req.session.isLoggedIn=true;
    res.redirect('/');
}



