const express = require('express');
const route = express.Router();

route.get('/',(req,res,next)=>{
    res.render('index',
    {
        path:'/',
        pageTitle:"index Page!",
    });    
})

module.exports=route;

