const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

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

    addToCart(product){
        const cartProduct = this.cart.items.findIndex(cp=> {
            return cp._id === product._id;
        }); // 이미 cart에 넣으려는 item에 cart에 존재하는지 확인 

        const updatedCart = {items:[{...product, quantity: 1}]}; // cart update 
        const db = getDb();
        db.collection('users').updateOne({_id:this._id},{$set :{cart: updatedCart}});
        // 해당 user를 찾아서, cart만 updatedcart로 updated 해준다. 
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
}
module.exports=User;