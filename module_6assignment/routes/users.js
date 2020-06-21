const express = require('express');
const route = express.Router();
const usersController = require('../Controller/user');

route.get('/users', usersController.getUsers);

route.post('/add-users',usersController.postAddUsers);

module.exports=route;
