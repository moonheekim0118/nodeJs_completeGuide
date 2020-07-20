const mongoose =require('mongoose');
const Schema = mongoose.Schema;
const Product = require('../Models/product');
const User= require('../Models/user');

/*
Order 모델에서 효율성을 위해서 한 사람당 하나의 Order 스키마만 생성하도록 하였다.
따라서 product정보는 productsp{items[]} 로 저장되고, items 내부에는 order를 저장한 product의 Id와, quantity를 저장하였다.
*/
const OrderSchema = new Schema({
   products: {
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
    ,user:{
        userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    }
});

OrderSchema.methods.addOrder=function(userId){ // order에 상품 추가- 이미 order에 있는 상품은 수량만 늘리기 
    return User.findById(userId)
    .then(user=>{
        const cart_items = user.cart.items;
        // 추가해준다. 이미 있는 상품은 quantity를 올려주고 아닌 상품은 추가..
        let updatedOrderItem=[...this.products.items];
        for(item of cart_items){
            const itemIndex = this.products.items.findIndex(cp=>{
                return cp.productId.toString()==item.productId.toString();
            })
            let newQuantity = 1;
            if(itemIndex>=0){ // 이미 order에 있는 경우 
                newQuantity+=this.products.items[itemIndex].quantity;
                updatedOrderItem[itemIndex].quantity=newQuantity;
            }
            else{ // 없는 경우 
                updatedOrderItem.push({productId:item.productId, quantity: item.quantity});
            }
        }
        this.products.items = updatedOrderItem;
        return this.save();
    }).catch(err=>console.log(err));
}

OrderSchema.methods.removeOrder=function(product_id){ // order에서 특정 상품 삭제 
    let updatedOrderItem = this.products.items.filter(item=>{
        return item.productId.toString() !== product_id.toString();
    });
    this.products.items=updatedOrderItem;
    return this.save();
}

//admin에서 삭제한 상품이 order에 남아있을 경우 order 갱신 
OrderSchema.methods.renewOrder=function(){
    const productIds = this.products.items.map(i=>{
        return i.productId;
    });
    const updatedOrderItems=[];
    return Product.find({'_id':productIds})
    .then(products=>{
        if(Object.keys(products).length < Object.keys(this.products.items).length){ // length가 다르다면 
            for( p of products){
                const qtity = this.products.items.find(i=>{
                    return i.productId.toString()===p._id.toString(); // id값이 같다면 
                }).quantity; // quantity 추출 
                if(qtity>0) updatedOrderItems.push({productId:p._id, quantity: qtity}); // quantity가 추출되었다면 
            }
            this.products.items=updatedOrderItems;
        }
        return this.save();
    })
}
module.exports = mongoose.model('Order', OrderSchema);