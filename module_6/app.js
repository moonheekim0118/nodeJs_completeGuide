const path = require('path');
const express = require('express');

const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');


app = express();

app.engine('handlebars', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname:'handlebars'})); //handlebars는 not built in ,pug은 built in, expressHbs() function은 초기화된 뷰 엔진을 return함
//따라서 해당 엔진을 handlebars 엔진에 지정 
app.set('view engine', 'handlebars'); //set up
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


