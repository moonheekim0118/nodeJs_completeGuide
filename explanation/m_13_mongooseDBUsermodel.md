# Mongoose를 이용해 User Model 구현하기

- User 모델의 element인 Cart는 따로 컬렉션이 없기 때문에 User 모델 method로 구현해주어야 한다

#### 1. User 모델 초기화

``` javascript
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
    cart:{ // cart objecㅅ 
        items:[
            {
            productId:{ 
                type:Schema.Types.ObjectId, // reference to a product
                ref:'Product', // 참조 정의  
                required: true
            },
             quantity: {
                 type: Number, 
                 required:true}
            }
            ]
    }
});
```


### 2. Cart에 Item 추가하기 
- mongoose 사용하지 않은 버전과 거의 같음. 
- 다른 점은 this.cart를 바꾸어주고, this.save() 를 해줌으로써 데이터베이스 업데이트를 해주는 것!

```javascript
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
```


#### 3. Cart의 특정 Item 삭제하기

1. filter 메서드를 이용해서 삭제할 product와 id값이 일치하지 않는 product들만 새로운 array에 저장해둔다.
2. this.cart.item을 새로운 array로 바꾸어준다.
3. this.save() 해줘서 db에도 변경을 해준다.

```javascript
userSchema.methods.deleteFromCart=function(productId){
    const updatedCartItems=this.cart.items.filter(item=>{
        return item.productId.toString() !== productId.toString();
    });
   this.cart.items=updatedCartItems;
    return this.save();
}
```


#### 4. Cart에 담긴 item들 불러오기
1. req.user 내 저장된 cart에 있는 productId를 통해 product를 가져와야한다. 
2. 우린 ProductId, 즉 담겨진 product의 참조값만 가지고 있으므로 poupulate 메서드를 통해 저장된 productId에 해당하는 product의 상세 정보를 가져오도록 한다.
3. 여기서 주의할 점은, populate는 promise형을 반환하지 않기 때문에 **exePopulate()** 메서드를 이용해서 전달해야 한다. 
4. 데이터가 반환 될 때 productId에 해당하는 product의 상세 정보는 'productId' 아래에 object로 저장되므로 view에서 접근할 때 주의해야 한다.
5. req.user 에 대해 poulate 메서드를 적용했으므로 반환 되는 것은 **User의 전체 정보**이다. 여기서 cart.items.productId 아래에 productId에 해당하는 product 정보가 object 형태로 저장되어 오는 것! 

```javascript
exports.getCart=(req,res,next)=>{ 
    req.user.populate('cart.items.productId') // user의 cart.items에 있는 것들을 productId기준으로 해당 product 의 정보까지 끌어오기
    //해당 product정보는 'productId' 아래에 생성된다. 
    .execPopulate() // populate가 promise형으로 안주므로..
    .then(user=>{ // 여기서 반환되는것은 user의 전체정보 
        console.log(user.cart.items); 
        const products=user.cart.items;

        res.render('shop/cart', {
            path:'/cart',
            pageTitle:'my Cart',
            product: products
        });
    })
    .catch(err=>console.log(err));

};
```