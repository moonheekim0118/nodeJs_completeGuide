const path= require('path');

const express = require('express');

const router = express.Router();


router.get('/',(req,res,next)=>{

    res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'));
    // __dirname ==> 현재 파일이 있는 폴더로 가기
    // ../ 해당 폴더의 상위폴더로 가기
});


module.exports=router;