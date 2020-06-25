const express = require('express');
const app =express();
const path= require('path');
const db = require('./util/database.js');

const adminRoute = require('./routes/admin.js');
const shopRoute = require('./routes/shop.js');
const errorsController = require('./controllers/errors');
const bodyParser = require('body-parser');
db.execute('SELECT * FROM products')
.then(result=>{
    console.log(result[0], result[1]);
})
.catch(err=>{
    console.log(err);    
});
app.set('view engine', 'ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoute);
app.use(shopRoute);

app.use(errorsController.get404page);

app.listen(3000);