const express = require('express');
const app =express();
const path= require('path');

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

app.listen(3000);