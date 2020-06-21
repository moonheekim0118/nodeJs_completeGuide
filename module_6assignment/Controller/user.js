const USERDATA = require('../Model/users');
exports.getUsers=(req,res,next)=>{
    USERDATA.fatchAll((userList)=>{
        res.render('users',{
            path:'/users',
            pageTitle:'USER LIST',
            userList: userList
        });
    });
 
}

exports.postAddUsers=(req,res,next)=>{ // / 에서 form으로 post들어오면 add-users에서 user_name 저장 후 /users로 리다이렉트
    const userList = new USERDATA(req.body.user_name);
    userList.save();
    res.redirect('/users'); 
}

exports.getAddUsers=(req,res,next)=>{
    res.render('index',
    {
        path:'/',
        pageTitle:"index Page!",
    });    
}