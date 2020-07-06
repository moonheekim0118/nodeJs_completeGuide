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
        /*
        const cartProduct = this.cart.items.findIndex(cp=> {
            return cp._id === product._id;
        }); // 이미 cart에 넣으려는 item에 cart에 존재하는지 확인 */

        const updatedCart = {items:[{productId: new mongodb.ObjectId(product._id), quantity: 1}]}; // cart update 
        // cart에 들어갈 내용은 productid refernce만! 왜냐하면 product 자체를 넣어버리면
        // 용량이 너무 크기도 하고 나중에 product 내용이 변경되면 여기에 있는 product까지 다 변경해야해서 너무 과부하..
        // 다라서 id값만 넣고, cart내용 보여줄 때엔 해당 id값으로 fectch 하면 된다.
        const db = getDb();
        return db.collection('users').updateOne({_id:this._id},{$set :{cart: updatedCart}});
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