const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
class Product{
    constructor(title, price, description, imageUrl,id , userId){
        this.title=title;
        this.price=price;
        this.description=description;
        this.imageUrl=imageUrl;
        this._id= id ? new mongodb.ObjectId(id) : null;
        this.userId=userId;
    }
    save(){
        const db = getDb();
        let dpOp="";
        if(this._id){ // _id가 set되어있다면 edit 모드 
            dpOp=db.collection('products').updateOne({_id:this._id},{$set: this});
        }
        else{ // 아니면 그냥 insert
            dpOp=db.collection('products') .insertOne(this);
        }
           // insert로 넘겨준 인자는 javascript에서 json으로 mongodb가 바꿔준다.
        return dpOp
        .then(result=>{
            console.log(result);
        })
        .catch(err=>console.log); 
        // mongoDb에게 데이터를 삽입할 table을 알려주는 메서드
        // 아직 table이 없으면 바로 create해준다.
        
    }
    static findById(ProductId){
        const db= getDb();
        return db.collection('products')
        .find({_id:new mongodb.ObjectId(ProductId)})
        .next()
        .then(product=>{
            console.log(product);
            return product;
        })
        .catch(err=>{
            console.log(err);
        });
    }

    static removeProduct(ProductId){
        const db = getDb();
        return db.collection('products')
        .deleteOne({_id:new mongodb.ObjectId(ProductId)})
        .then(result=>{
         console.log(result);   
        })
        .catch(err=>console.log(err));
    }
    static fetchAll(){
        // find()자체는 promise가 아니라 cursor를 반환하므로 toArray를 해주어야한디
        const db = getDb();
        return db.collection('products')
        .find()
        .toArray()
        .then(products=>{
            console.log(products);
            return products;
        })
        .catch(err=> {console.log(err)});
    }
}

module.exports = Product;