const express = require('express');
const app =express();
const path= require('path');

const adminRoute = require('./routes/admin.js');
const shopRoute = require('./routes/shop.js');
const errorsController = require('./controllers/errors');
const bodyParser = require('body-parser');

const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{
    User.findById("5f01694e0857cd31cd69f86a") // amdin user의 id 
    .then(user=>{
        req.user=new User(user.name, user.email, user._id, user.cart); // req.user에 저장 
        next();
    })
    .catch(err=>console.log(err));
});

app.use('/admin',adminRoute);
app.use(shopRoute);
app.use(errorsController.get404page);

mongoConnect(() => {
    app.listen(3000);
});