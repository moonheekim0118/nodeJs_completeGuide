const express = require('express');
const app =express();
const path= require('path');
const mongoose =require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MONGODB_URI='mongodb+srv://moonhee:asdf6405@cluster0.9j2jo.mongodb.net/shop';

const store = new MongoDBStore({
    uri:MONGODB_URI,
    collection:'sessions'
});


const adminRoute = require('./routes/admin.js');
const shopRoute = require('./routes/shop.js');
const authRoute = require('./routes/auth.js');
const errorsController = require('./controllers/errors');
const bodyParser = require('body-parser');

const User = require('./models/user');
app.use(session({secret:'my secret', resave:false, saveUninitialized:false, store:store}));


app.set('view engine', 'ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));


app.use('/admin',adminRoute);
app.use(shopRoute);
app.use(authRoute);
app.use(errorsController.get404page);

mongoose.connect(MONGODB_URI)
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