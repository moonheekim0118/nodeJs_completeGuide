const express = require('express');
const route = express.Router();
const usersController = require('../Controller/user');

route.get('/',usersController.getAddUsers);

module.exports=route;

