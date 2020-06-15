const express = require('express'); 
const app = express();

/*
app.use((req,res,next)=>{
    console.log('first middleware!');
    next();
});


app.use((req,res,next)=>{
    console.log('second middleware!');
    res.send('<h1>hello express~</h1>');
});*/

app.use('/users',(req,res,next)=>{
    console.log('users page');
    res.send('<h1>this is users page</h1>');
});

app.use('/',(req,res,next)=>{
    console.log('main page');
    res.send('<h1>this is default page</h1>');
});

app.listen(3000);