const express = require('express');
const app =express();
const path= require('path');
const mongoose =require('mongoose');

const adminRoute = require('./routes/admin.js');
const shopRoute = require('./routes/shop.js');
const authRoute = require('./routes/auth.js');
const errorsController = require('./controllers/errors');
const bodyParser = require('body-parser');

const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));


app.use((req,res,next)=>{
    User.findById("5f0519efbe41f10860a1bac0") // amdin user의 id 
    .then(user=>{
        req.user=user;
        next();
    })
    .catch(err=>console.log(err));
});

app.use('/admin',adminRoute);
app.use(shopRoute);
app.use(authRoute);
app.use(errorsController.get404page);

mongoose.connect('mongodb+srv://moonhee:asdf6405@cluster0.9j2jo.mongodb.net/shop?retryWrites=true&w=majority')
.then(result=>{
    User.findOne(). // args안넘기면 첫번째 데이터 반환 
    then(user=>{
        if(!user){
            const user = new User({
                name:'Admin',
                email:'admin@amdin',
                cart:{
                    items:[]
                }
            });
            user.save();
        }
    })
    .catch(err=>console.log(err));
    app.listen(3000);
}).catch(err=>console.log(err));