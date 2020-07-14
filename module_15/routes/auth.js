const express= require('express');
const route = express.Router();
const authController = require('../controllers/auth');

route.get('/login', authController.getLogin);
route.post('/login',authController.postLogin);
route.post('/logout', authController.postLogout);
route.get('/signUp',authController.getSignUp);
route.post('/signUp',authController.postSignUp);
module.exports=route;