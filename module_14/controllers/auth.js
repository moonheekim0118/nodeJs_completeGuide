exports.getLogin=(req,res,next)=>
{
    const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1] === 'true';
    res.render('auth/login', {
        path:'/login',
        pageTitle:'login',
        isAuthenticated: isLoggedIn
    });
}

exports.postLogin=(req,res,next)=>
{
    res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10');
    res.redirect('/');
}



