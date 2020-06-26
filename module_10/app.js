const express = require('express');
const app =express();
const path= require('path');
const sequelize = require('./util/database.js');

const adminRoute = require('./routes/admin.js');
const shopRoute = require('./routes/shop.js');
const errorsController = require('./controllers/errors');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoute);
app.use(shopRoute);

app.use(errorsController.get404page);

sequelize.sync().then(result =>{
    //console.log(result);
    app.listen(3000);
}).catch(err=>{
    console.log(err);
}
); //모든 model에 있는 table을 생성해준다. ( 이미 존재하면 override 하지 않음 )