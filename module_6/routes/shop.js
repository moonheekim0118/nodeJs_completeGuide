const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = require('../util/path');

const adminData = require('./admin');

router.get('/',(req,res,next)=>{
   
    const products = adminData.products;
   // res.sendFile(path.join(rootDir,'views','shop.html'));
   res.render('shop', {
    prods:products, //product 정보 
    pageTitle:"Shop",
    path:"/", 
    hasProducts: products.length>0, //product가 1개 이상있으면 true 없으면 false
    activeShop:true //현재 route가 shop인지 ==> active를 위해서
   // layout:false default layout 쓰지 않으려면 넘겨주기 
    }); //app.js에서 default 된 templating engine을 사용하게 된다. 
});

module.exports=router;