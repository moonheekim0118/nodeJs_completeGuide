const express = require('express');
const path = require('path');
const route = express.Router();
const rootDir = require('../util/path');

route.get('/users',(req,res,next)=>{
    res.sendFile(path.join(rootDir,'view','users.html'));
});

module.exports=route;