const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('../models/product');
const Order = require('../models/order');
const userSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
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
/*
class User{
    constructor(username,email,id,cart){
        this.name=username;
        this.email=email;
        this._id = id? new mongodb.ObjectId(id) : null;
        this.cart=cart; // {items:[]}
    }
    save(){
        const db = getDb();
        let dbOp;
        if(this._id){
            dbOp=db.collection('users').updateOne({_id:this._id}, {$set: this});
        }
        else{
            dpOp=db.collection('users').insertOne(this);
        }
        return dpOp
        .then(user=>{
            console.log(user);
        })
        .catch(err=>console.log(err));
    }

    renewCart(products){ // cart에 있는 item이 admin에서 delete되면, getCart에서는 안띄워지지만 데이터베이스에는 남아있음.
                        //이를 방지하기 위해서 database내에 있는 지워진 products까지 지워준다.
        const db = getDb();
        const updatedCartItems=[];
        var p;
        for(p of products){
            const qtity= this.cart.items.find(i=>{ // 찾은 product 이용하기 , 현재 cart에서 찾기 
                return i.productId.toString() === p._id.toString(); // 특정 product와 cart내 product가 id가 일치한다면 
        }).quantity; 
            updatedCartItems.push({productId: new mongodb.ObjectId(p._id), quantity: qtity});
        }
        db.collection('users').updateOne({_id:this._id},{$set :{cart: {items: updatedCartItems }}});
    }

    getCart(){
        // cart에 있는 item들 반환하기
        const db = getDb();
        const productIds=this.cart.items.map(i=> {
            return i.productId;
        });
        // 왜 product 컬렉션에서 가져오냐면, product의 상세정보를 가져오기 위해!
        return db.collection('products').find({_id: {$in: productIds}}).toArray() // product컬렉션에서 해당 id가진 것 모두 반환 -> 커서타입에서 array로
        .then(products=>{ // cart에 들어간 products 찾음 
           if(Object.keys(products).length < Object.keys(this.cart.items).length){ // 객체형식이라서 길이 이렇게 구해준다!!
            // 만약 두 길이가 다르면, 특히 product가 더 적으면 admin에서 product가 delete되었다는 것이므로!
            // 꼭 renew해주도록 한다.
            this.renewCart(products);
           }
            return products.map(p=>{ // 해당 product의 quantity 역시 반환해줘야함 
                return {...p, // product 전부 
                    quantity: this.cart.items.find(i=>{ // 찾은 product 이용하기 , 현재 cart에서 찾기 
                        return i.productId.toString() === p._id.toString(); // 특정 product와 cart내 product가 id가 일치한다면 
                }).quantity 
             };
            });
        })
        .catch(err=>console.log(err));
    }
    addToCart(product){
        
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
            updatedCartItems.push({productId: new mongodb.ObjectId(product._id), quantity: 1});
        }
        const updatedCart ={
            items: updatedCartItems  
        };
        
        const db = getDb();
        return db.collection('users').updateOne({_id:this._id},{$set :{cart: updatedCart}});
        // 해당 user를 찾아서, cart만 updatedcart로 updated 해준다. 
    }
    
    deleteFromCart(productId){ // cart에서 특정 아이템 삭제하기.

        const db = getDb();
        const cartProductIndex = this.cart.items.findIndex(cp=> {
            return cp.productId.toString()==productId;
        });
        const updatedCartItems=[...this.cart.items];
        updatedCartItems.splice(cartProductIndex,1); // 삭제해주고 다시..update해주기 

        return db.collection('users').updateOne({_id:this._id},{$set:{cart: {itmes: updatedCartItems}}});

    }
    static findById(userId){
        const db = getDb();
        return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)})
        // findOne은 cursor형태가 아니라 바로 element를 보낸다. 
        .then(user=>{
            console.log(user);
            return user;
        })
        .catch(err=>console.log(err));
    }

    addOrder() { // order로 가져가기 
        const db = getDb();
        return this.getCart() // cart에서 proudct 받아오기 
        .then(products=> {
            const order ={
                items: products, // order item에 prduct 추가 
                user:{
                    _id: new mongodb.ObjectId(this._id), // 어떤 user인지 나타내기 위해 userdata 추가 
                    name: this.name,
                }
            };
            return db.collection('orders').insertOne(order) // order collection에 넣기 
        })
        .then(result=>{
            this.cart.items=[]; // cart에서 비우기 
            return db.collection('users').updateOne({_id:this._id},{$set:{cart:{items: []}}}); // db에서 지우기 

        })
        .catch(err=>console.log(err));
    }

    getOrder(){
        const db = getDb();
        //현재 user 에 해당하는 orders 찾아서 array로 변환하여 내보내기 
        return db.collection('orders').find({'user._id':new mongodb.ObjectId(this._id)}).toArray();
    }
}
*/
