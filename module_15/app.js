const express = require('express');
const app =express();
const path= require('path');
const mongoose =require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MONGODB_URI='mongodb+srv://moonhee:asdf6405@cluster0.9j2jo.mongodb.net/shop';
const csrf = require('csurf');
const flash = require('connect-flash');

const store = new MongoDBStore({
    uri:MONGODB_URI,
    collection:'sessions'
});

const csrfProtection = csrf();

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
app.use(session({secret:'my secret', resave:false, saveUninitialized:false, store:store})); // session db에 등록 

// after initialize session
app.use(csrfProtection);
app.use(flash());

app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    else{ // login 되어있을 경우 
    User.findById(req.session.user._id) // req.session에 저장된 user는 mongoDB 모델 자체가 아니라 data이므로
    // 몽구스 메서드 사용못함! 따라서 해당 id로 User 데이터베이스를 찾아서 req.user에 넣어주도록 한다.
    .then(user=>{
        if(!user){ // 유저가 없을 시 
            return next();
        }
        req.user= user; 
        next();
    }).catch(err=>{  // database problem과 같이 system problem에서 thorw함 
        const error = new Error(err);
        error.httpStatusCode = 500;
       return next(error);
    });
}
})
app.use((req,res,next)=>{ /*앞으로 나올 모든 rendering에 아래 데이터 포함시키기*/ 
    res.locals.isAuthenticated = req.session.isLoggedIn; // for checking if it's logged in
    res.locals.csrfToken= req.csrfToken(); // for protecting our app 
    next();
})

app.use('/admin',adminRoute);
app.use(shopRoute);
app.use(authRoute);

app.use('/500',errorsController.get500page);
app.use(errorsController.get404page);

app.use((error,req,res,next)=>{
    res.redirect('/500');
})

mongoose.connect(MONGODB_URI)
.then(result=>{
    app.listen(3000);
}).catch(err=>console.log(err));