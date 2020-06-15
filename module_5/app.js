const express = require('express');

const app = express();

app.use('/',(req,res,next)=>{

    console.log('first middleware');
    next(); //next 혹은 response를 해야함. next는 다음 미들웨어로 넘긴다는 뜻 
});

app.use('/add-product',(req,res,next)=>{

    console.log('second middleware');
    res.send('<h1>this is add product page! </h1>');

});

app.use('/',(req,res,next)=>{

    console.log('third middleware');
    res.send('<h1>hello welcome! </h1>');

});




app.listen(3000);
