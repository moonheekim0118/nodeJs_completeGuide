//error 기준 controller
exports.get404page=(req,res,next)=>{
    res.status(404).render('404',{
        pageTitle:"404 error",
        path:"",
        isAuthenticated: req.isLoggedIn
    });
}