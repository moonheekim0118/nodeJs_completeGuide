const express = require('express');
const app = express();
const path = require('path');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const errorsController= require('./Controllers/errors');
const AdminRouter = require('./routes/admin');
const ShopRouter = require('./routes/shop');
const AuthRouter = require('./routes/auth');
const User = require('./Models/user');
const csrf = require('csurf');
const csrfProtection = csrf();
const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'images');
    },
    filename: (req,file,cb)=>{
        cb(null, file.filename+'-'+file.originalname);
    }
});

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
};

const session = require('express-session');
const MongoDBStore=require('connect-mongodb-session')(session);
const MONGODB_URI=require('./database'); // db URI 
const store = new MongoDBStore ({ // 연동할 db 설정 
    uri : MONGODB_URI,
    collection:'sessions'
});
app.set('view engine', 'ejs');
app.set('views', 'views'); // view engine 설정

app.use(bodyParser.urlencoded({extended:false}));
app.use(multer({storage :fileStorage, fileFilter:fileFilter}).single('image'));
app.use(express.static(path.join(__dirname,'public')));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(session({secret:'my secret', resave:false, saveUninitialized:false, store:store})); // 세션 db 연동 

app.use(csrfProtection); // csrf 
app.use((req,res,next)=>{
   if(req.session.user){ // session.user가 저장되었다면 == 로그인 되었다면 
       User.findOne(req.session.user._id) // 해당user찾기 
       .then(user=>{
           req.user = user; // req.user에 저장해서 전역에서 접근 가능하도록 
           next();
       })
       .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
   }
   else{
       next();
   }
})

app.use((req,res,next)=>{
   res.locals.isAuthenticated = req.session.isLoggedIn;
   res.locals.csrfToken=req.csrfToken();
   next();
});
//admin 라우트 연결
app.use('/admin',AdminRouter);


app.use(ShopRouter);

app.use(AuthRouter);

app.use('/500',errorsController.get500error);

app.use(errorsController.get404error);

app.use((error,req,res,next)=>{
    res.redirect('/500');
})

mongoose.connect(MONGODB_URI)
.then(result=>{
    app.listen(3000);
}).catch(err=>{
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
})