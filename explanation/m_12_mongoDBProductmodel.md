# MongoDB를 이용해 Product Model 구현하기

- 몽구스 사용하지 않는 버전이므로 Model은 clas형태로 저장된다
- 삽입 시 해당 컬렉션이 존재하지 않으면 몽고DB는 자동으로 생성해준다

### Product Model
#### 1.생성과 저장  
```javascript
nst getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
class Product{
    constructor(title, price, description, imageUrl,id , userId){ // 생성자 
        this.title=title;
        this.price=price;
        this.description=description;
        this.imageUrl=imageUrl;
        this._id= id ? new mongodb.ObjectId(id) : null; // id 값이 null 이라면 edit으로 인식해준다
        this.userId=userId;
    }

     save(){ // 저장 
        const db = getDb(); // 현재 연결된 클러스터 가져오기 
        let dpOp="";
        if(this._id){ // _id가 set되어있다면 edit 모드 
            dpOp=db.collection('products').updateOne({_id:this._id},{$set: this}); // products 컬렉션에서 id일치하는 항목을 찾아 update해주기 
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
    }

}
```

#### 2.모든 데이터 반환하기
```javascript
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
```


#### 3.id값과 일치하는 데이터 찾기 
```javascript
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
```

#### 4.특정 상품 지우기
```javascript
  static removeProduct(ProductId){
        const db = getDb();
        return db.collection('products')
        .deleteOne({_id:new mongodb.ObjectId(ProductId)})
        .then(result=>{
         console.log(result);   
        })
        .catch(err=>console.log(err));
    }
```