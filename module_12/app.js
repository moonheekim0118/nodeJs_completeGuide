const express = require('express');
const app =express();
const path= require('path');

const adminRoute = require('./routes/admin.js');
const shopRoute = require('./routes/shop.js');
//const errorsController = require('./controllers/errors');
const bodyParser = require('body-parser');

const mongoConnect = require('./util/database').mongoConnect;

app.set('view engine', 'ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{ // sequelize 에서 생성한 user를 req에 등록 
    next();
});

app.use('/admin',adminRoute);
app.use(shopRoute);
//app.use(errorsController.get404page);

mongoConnect( () => {
    console.log();
    app.listen(3000);
});