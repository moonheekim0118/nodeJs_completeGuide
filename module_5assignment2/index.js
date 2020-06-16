const path = require('path');

const express =require('express');

const app = express();

const userRouter = require('./routes/user');
const showRouter = require('./routes/show');

app.use(express.static(path.join(__dirname,'public')));

app.use(userRouter);

app.use(showRouter);

app.listen(3000);

