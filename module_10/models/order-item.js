const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const OrderItem = sequelize.define('orderItem', { // cart 에 들어갈 Product 정의 
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
});

module.exports=OrderItem;
