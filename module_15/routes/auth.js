const express= require('express');
const route = express.Router();
const authController = require('../controllers/auth');

route.get('/login', authController.getLogin);
route.post('/login',authController.postLogin);

route.post('/logout', authController.postLogout);


route.get('/signUp',authController.getSignUp);
route.post('/signUp',authController.postSignUp);


route.get('/reset',authController.getReset);
route.post('/reset',authController.postReset);

route.get('/new-password/:token', authController.getUpdatePassword);
route.post('/new-password', authController.postUpdatePassword);
module.exports=route;