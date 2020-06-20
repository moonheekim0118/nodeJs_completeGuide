const express = require('express');
const route = express.Router();
const userList=[]; //req로 받은 users name 저장해놓기 

route.get('/users',(req,res,next)=>{
    res.render('users',{
        path:'/users',
        pageTitle:'USER LIST',
        userList: userList
    });
})

route.post('/add-users',(req,res,next)=>{ // / 에서 form으로 post들어오면 add-users에서 user_name 저장 후 /users로 리다이렉트
    console.log(req.body.user_name);
    userList.push(req.body.user_name);
   /* res.render('users',
    {
        path:'/users',
        pageTitle: 'USER LIST',
        userList: userList
    });*/
    res.redirect('/users'); 
})

module.exports=route;
