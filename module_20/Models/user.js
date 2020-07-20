const mongoose =require('mongoose');
const Schema = mongoose.Schema;
const Product = require('../Models/product');
const userSchema= new Schema({
    email:{
        type:String,
        required:true
     },
     resetToken:String,
     resetTokenExpiration:Date,
    password:{ 
        type:String, 
        required:true
    },
     cart:{
        items:[
            {
                productId:{
                    type:Schema.Types.ObjectId,
                    ref:'Product',
                    required:true
                },
                quantity:{
                    type:Number,
                    required:true
                }
            }
        ] 
     }
});

// cart에 새로운 element를 add 하는 메서드를 만들어야 한다.
userSchema.methods.addToCart=function(product_id){
    // 이미 Cart에 해당 product가 있는지 검사한다.
        // 있을 경우 quantity만 변경해준다.
        // 없을 경우 새로 추가한다.
    const cartProductIndex= this.cart.items.findIndex(cp=>{
        return cp.productId.toString()==product_id.toString();
    });
    const updatedCartitems=[...this.cart.items];
    var newQuantity = 1;
    if(cartProductIndex >=0){
        newQuantity += this.cart.items[cartProductIndex].quantity;
        updatedCartitems[cartProductIndex].quantity=newQuantity;
    }
    else{
        updatedCartitems.push({productId:product_id, quantity:newQuantity});
    }
    this.cart.items=updatedCartitems;
    console.log(this.cart.items);
    return this.save();
}

userSchema.methods.removeFromCart=function(product_id){
    let updatedCartitems = this.cart.items.filter(item=>{
        return item.productId.toString() !== product_id.toString();
    });
    this.cart.items=updatedCartitems;
    return this.save();
    
}

userSchema.methods.clearCart=function(){
    this.cart.items=[];
    return this.save();
}
// amdin에서 삭제한 아이템이 cart에 남아있을 경우 cart 갱신
userSchema.methods.renewCart=function(){
    const productIds= this.cart.items.map(i=>{
        return i.productId;
    });
    const updatedCartItems=[];
   return Product.find({'_id':productIds})
    .then(products=>{
        if(Object.keys(products).length < Object.keys(this.cart.items).length){
            for(p of products){
                const qtity = this.cart.items.find(i=>{
                    return i.productId.toString() === p._id.toString();
                }).quantity;
                if(qtity>0) updatedCartItems.push({productId: p._id, quantity:qtity});
            }
            this.cart.items=updatedCartItems;
        }
        return this.save();
    }).catch(err=>console.log(err));

}
module.exports= mongoose.model('User', userSchema);