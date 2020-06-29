const express = require('express');
const app =express();
const path= require('path');
const sequelize = require('./util/database.js');

const adminRoute = require('./routes/admin.js');
const shopRoute = require('./routes/shop.js');
const errorsController = require('./controllers/errors');
const bodyParser = require('body-parser');

const Product = require('./models/product');
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{ // sequelize 에서 생성한 user를 req에 등록 
    User.findByPk(1)
    .then(user=>{
        req.user = user;
        next();
    })
    .catch(err=>console.log(err));
    // req에 저장해놓음으로써, 모든 미들웨어에서 req.user로 접근 가능 
});

app.use('/admin',adminRoute);
app.use(shopRoute);

app.use(errorsController.get404page);

Product.belongsTo(User,{ constraints: true, onDelete:'CASCADE' }); // User Creates this product
User.hasMany(Product);

sequelize.sync() // passing {force:true} === override table 
.then(result =>{
    return User.findByPk(1); // id === 1 유저가 있는지 
})
.then(user=>{
    if(!user){
        return User.create({name:'Moonhee', email:'moonhee118118@gmail.com'}); //없다면 생성해주기 
    }
    return Promise.resolve(user); 
})
.then(user=>{
    console.log(user);
    app.listen(3000); // 유저 생성 후 서버 만들기 
})
.catch(err=>{
    console.log(err);
}
); //모든 model에 있는 table을 생성해준다. ( 이미 존재하면 override 하지 않음 )