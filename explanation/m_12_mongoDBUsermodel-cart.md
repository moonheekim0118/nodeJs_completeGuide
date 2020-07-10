# User 내 Cart object 관련 메서드

#### 1. 카트에 특정 상품 넣기
0. 해당 상품의 reference, 죽 Id만 저장하도록 한다. ( 추후에 prdouct 정보가 변경 될 수 있으므로 )
1. 카트에 넣을 product가 이미 카트에 있는지 확인한다.
2. cart내 Item을 다른 Array에 복사해놓는다.
3. 카트에 넣을 product가 이미 존재한다면 복사한 Array의 해당 index의 quantity를 증가시켜준다.
4. 카트에 넣을 product가 존재하지 않는다면 복사한 Arrayd에 해당 product Id와 quantity를 1로 push 해준다.
5. user컬렉션을 update 해준다 

``` javascript
    addToCart(product){
        const cartProductIndex = this.cart.items.findIndex(cp=> {
            return cp.productId.toString() === product._id.toString();
        }); // 이미 cart에 넣으려는 item에 cart에 존재하는지 확인
           // 존재한다면 해당 item의 cart내 인덱스 반환, 없으면 -1반환 
        let newQuantity = 1;
        const updatedCartItems=[...this.cart.items]; // 전체 카트 복사 
        if(cartProductIndex >= 0){ //이미 해당 item이 cart내에 존재한다면 
            newQuantity= this.cart.items[cartProductIndex].quantity+1; 
            updatedCartItems[cartProductIndex].quantity=newQuantity; // 수량증가
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
```


#### 2. 카트에 있는 모든 상품 반환하기 
1. renewCart 함수
    - 인자로 받는 products는 현재 admin 에서 등록되고, cart에 있는 item들과 id가 일치하는 모든 products이다.
    - 해당 products id와 cart에 등록된 product id가 일치한다면, updatedCart에 product정보를 push 해준다
    - 이렇게 함으로써 admin에서 delete된 product는 updatedCart에 들어갈 수 없게 된다.

```javascript
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
```

2. getCart 함수
    1. 카트에 들어가 있는 모든 product의 id를 반환한다.
    2. admin products에 등록된 모든 product 중 해당 id와 일치하는 product를 반환한다. (여기서 Array형태로 바꾸어준다)
        - 이렇게 함으로써 카트 정보를 내보낼 때, product의 세부 정보를 모두 전달 할 수 있도록 한다. (cart에는 id만 저장되어 있으므로)
    3. 만약 찾은 products 들의 length와 현재 cart에 들어가있는 products들의 length가 다르다면, admin products에 수정이 생겼고, cart는 이를 반영하지 못했다는 것이므로 renewCart를 해주어 cart 정보를 갱신해준다.
    4. 전체 products를 product정보와 quantity로 map 하여 return 해준다.
        - 여기서 quantity는 해당 product의 id와 일치하는 요소를 cart에서 찾은 후 cart 내의 quantity를 반환하면 도니다. 

```javascript
 getCart(){
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
```


### 3. 카트에 있는 특정 상품 삭제하기 

```javascript
    deleteFromCart(productId){ // cart에서 특정 아이템 삭제하기.
        const db = getDb();
        const cartProductIndex = this.cart.items.findIndex(cp=> {
            return cp.productId.toString()==productId;
        });
        const updatedCartItems=[...this.cart.items];
        updatedCartItems.splice(cartProductIndex,1); // 삭제해주고 다시..update해주기 

        return db.collection('users').updateOne({_id:this._id},{$set:{cart: {itmes: updatedCartItems}}});

    }
```
