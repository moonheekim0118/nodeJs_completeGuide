const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const orderSchema = new Schema({
    products:[{
        product : {type: Object, required:true},
        quantity: {type: Number, required:true} 
    }]
    ,user:{
       userid:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
       },
       name:{
        type:String,
        required:true
       }
    }
})

orderSchema.methods.createOrder=function(){
    req.user.cart;
}

module.exports=mongoose.model('Order', orderSchema);