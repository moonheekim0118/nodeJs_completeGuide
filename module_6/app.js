const path = require('path');
const express = require('express');

const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');
const bodyParser = require('body-parser');

app = express();

app.set('view engine', 'ejs'); //set up
app.set('views', 'views'); //어디에 template이 있는지 알려주는 것 

app.use(bodyParser.urlencoded({extended:false})); //파싱 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin',adminData.routes);
app.use(shopRouter);

app.use((req,res,next)=>{
   // res.sendFile(path.join(__dirname,'views','404.html'));
   res.status(404).render('404',{pageTitle:"404 error"});
});
app.listen(3000);


