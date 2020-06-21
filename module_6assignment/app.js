const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const indexRoute = require('./routes/index.js');
const usersRoute = require('./routes/users.js');
const errorController = require('./Controller/error');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended:false})); //파싱 
app.use(express.static(path.join(__dirname, 'public'))); //css 링크
app.use(indexRoute);
app.use(usersRoute);
app.use(errorController.get404);
app.listen(3000);