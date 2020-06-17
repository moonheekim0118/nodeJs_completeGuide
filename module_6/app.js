const path = require('path');
const express = require('express');

const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');
const bodyParser = require('body-parser');

app = express();

app.use(bodyParser.urlencoded({extended:false})); //파싱 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin',adminData.routes);
app.use(shopRouter);

app.listen(3000);


