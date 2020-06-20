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

route.post('/users',(req,res,next)=>{
    console.log(req.body.user_name);
    userList.push(req.body.user_name);
    res.render('users',
    {
        path:'/users',
        pageTitle: 'USER LIST',
        userList: userList
    });
})

module.exports=route;
