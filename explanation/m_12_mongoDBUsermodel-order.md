# User에서 처리되는 Order 컬렉션

- 왜 따로 Model을 안만들고 ? : cart Item을 이용해야하므로 User 내에 구현되는것이 효율적이다

#### 1. Order에 전체 Cart 추가하기
1. getCart 메서드에서 mapping된 product 정보 전체를 받아온다. 
2. 해당 product 정보를 새로운 order 생성 할 때 items key의 value로 넣고, name key의 value는 현재 user 즉, this.name으로 해준다.
3. 생성된 order 변수를 orders 컬렉션에 insert 해준다. - 이 때 해당 컬렉션이 없으면 몽고DB가 자동으로 생성해준다.

```javascript
    addOrder() { 
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
```


#### 2. 현재 user의 orders 반환하기

```javascript
    getOrder(){
        const db = getDb();
        //현재 user 에 해당하는 orders 찾아서 array로 변환하여 내보내기 
        return db.collection('orders').find({'user._id':new mongodb.ObjectId(this._id)}).toArray();
    }
```