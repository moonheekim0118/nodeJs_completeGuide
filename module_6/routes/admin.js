const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = require('../util/path');
const products = [];

router.get('/add-product',(req,res,next)=>{
    res.sendFile(path.join(rootDir,'views','admin.html')); //파일보내기 
});

router.post('/add-product',(req,res,next)=>{
    products.push({title:req.body.title});
    res.redirect('/'); // 기본페이지로 리다이렉트 
})

exports.routes=router;
exports.products=products; // 두개 이상 expors해주려면 exports 각각 객체에 저장해놓으면 된다.
