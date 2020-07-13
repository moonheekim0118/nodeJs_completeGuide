const express= require('express');
const route = express.Router();
const authController = require('../controllers/auth');

route.get('/login', authController.getLogin);
route.post('/login',authController.postLogin);

module.exports=route;