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

    getCart(){
        // cart에 있는 item들 반환하기
        const db = getDb();
        const productIds=this.cart.items.map(i=> {
            return i.productId;
        });
        // 왜 product 컬렉션에서 가져오냐면, product의 상세정보를 가져오기 위해!
        return db.collection('products').find({_id: {$in: productIds}}).toArray() // product컬렉션에서 해당 id가진 것 모두 반환 -> 커서타입에서 array로
        .then(products=>{ // cart에 들어간 products 찾음 
            return products.map(p=>{ // 해당 product의 quantity 역시 반환해줘야함 
                return {...p, // product 전부 
                    quantity: this.cart.items.find(i=>{ // 찾은 product 이용하기 , 현재 cart에서 찾기 
                    return i.productId.toString() === p._id.toString(); // 특정 product와 cart내 product가 id가 일치한다면 
                }).quantity //해당 요소의 quantity 반환 
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