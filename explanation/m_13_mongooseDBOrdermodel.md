# Mongoose를 이용해 Order Model 구현하기


#### 1. Order model 초기화
1. Order model에는 Products와 User의 정보가 들어가야 한다.
2. products 정보는 Array로 하여 productId와 quantity를 저장하도록 한다. 
    Array로 하는 이유는 하나의 order 에 여러 product 정보가 저장될 수 있기 때문이다.
3. User 정보는 UserId와 name을 저장하도록 한다. 
4. products type이 Object인 이유는 product 스키마의 정보를 모두 저장하기 위해서이다

``` javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const orderSchema = new Schema({
    products:[{
        product : {type: Object, required:true},
        quantity: {type: Number, required:true} 
    }]
    ,user:{
       userid:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
       },
       name:{
        type:String,
        required:true
       }
    }
})

orderSchema.methods.createOrder=function(){
    req.user.cart;
}

module.exports=mongoose.model('Order', orderSchema);
```


#### 2. Order 추가하기 
1. 새로운 order를 생성 할 때 user 정보는 req.user._id (혹은 req.user == 몽구스가 알아서 id로 바꾸어준다) req.user_name 으로 저장가능
2. 그렇다면 products 정보는 어떻게 할까? 현재 cart에 있는 모든 products를 넣어야하는데, products의 상세정보도 넣어주어야 한다.
3. 이는 우리가 Controller에서 getCart했던것 처럼 구현해주면 된다. 즉, req.user를 가져오는데 여기서 cart.item.productId로 populate를 해줘서 모든 정보를 뽑아오는 것이다.
4. 이렇게하면 user.cart.items에서 products의 정보, 즉 productId 아래의 object와 quantity 를 모두가 져올 수 있다. 
5. 이를 map 메서드를 이용하여 object 형태로 저장해주고 new order 생성시 products 필드의 인자로 넣어주면 된다. 
6. order.save() 를 호출하여 데이터베이스에 반영해준다. 
7. req.user.clearCart(); 를 호출하여 현재 cart의 요소를 모두 삭제해준다.

```javascript
exports.postCreateOrder=(req,res,next)=>
{
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user=>{
        const products = user.cart.items.map(i=>{
            // i.productId에 meta data가 있으므로 ... ~ ._doc을 해준다.
            return {quantity: i.quantity, product:{...i.productId._doc}}
        });
        const order = new Order({
            user:{
                userid:req.user._id,
                name:req.user.name
            },
            products:products
        });
        return order.save();
    }).then(result=>{
        return req.user.clearCart();
    })
    .then(result=>{
        res.redirect('/orders');
    })
    .catch(err=>console.log(err))
}
```