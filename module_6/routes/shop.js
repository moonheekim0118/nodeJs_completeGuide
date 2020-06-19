const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = require('../util/path');

const adminData = require('./admin');

router.get('/',(req,res,next)=>{
   
    const products = adminData.products;
   // res.sendFile(path.join(rootDir,'views','shop.html'));
   res.render('shop', {prods:products, pageTitle:"Shop", path:"/"}); //app.js에서 default 된 templating engine을 사용하게 된다. 
});

module.exports=router;