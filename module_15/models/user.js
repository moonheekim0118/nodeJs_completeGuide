const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('../models/product');
const Order = require('../models/order');
const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    resetToken:String,
    resetTokenExpiration:Date,
    cart:{
        items:[
            {
            productId:{
                type:Schema.Types.ObjectId, // reference to a product
                ref:'Product', 
                required: true
            },
             quantity: {
                 type: Number, 
                 required:true}
            }
            ]
    }
});

userSchema.methods.deleteFromCart=function(productId){
    const updatedCartItems=this.cart.items.filter(item=>{
        return item.productId.toString() !== productId.toString();
    });
   this.cart.items=updatedCartItems;
    return this.save();
}

userSchema.methods.addToCart=function(product){
    const cartProductIndex = this.cart.items.findIndex(cp=> {
        return cp.productId.toString() === product._id.toString();
    }); // 이미 cart에 넣으려는 item에 cart에 존재하는지 확인
       // 존재한다면 해당 item의 cart내 인덱스 반환, 없으면 -1반환 
    let newQuantity = 1;
    const updatedCartItems=[...this.cart.items]; // 전체 카트 복사 
    if(cartProductIndex >= 0){ //이미 해당 item이 cart내에 존재한다면 
        newQuantity= this.cart.items[cartProductIndex].quantity+1; 
        this.cart.items[cartProductIndex].quantity=newQuantity; // 수량증가
    }
    else{ // 존재하지 않는다면 
        updatedCartItems.push({productId: product._id, quantity: 1});
    }
    const updatedCart ={
        items: updatedCartItems  
    };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.clearCart=function(){
    this.cart={};
    return this.save();
}

module.exports= mongoose.model('User', userSchema);