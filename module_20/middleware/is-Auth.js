// login 되어있는지 확인해주는 미들웨어
// admin post 라우팅에서 먼저 실행된다.
module.exports =(req,res,next)=>{
    if(!req.session.isLoggedIn){
        return res.redirect('/login');
    }
    next();
}