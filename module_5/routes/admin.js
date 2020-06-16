const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

// /admin/add-product  => GET
router.get('/add-product',(req,res,next)=>{

   //res.sendFile(path.join(__dirname,'..','views','add-product.html'));
   res.sendFile(path.join(rootDir,'views','add-product.html'));
});

// /admin/add-product  => POST
router.post('/add-product',(req,res,next)=>{ //get과 post방식으로 다르기때문에, 같은 path를 써도 상관없다. 
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;