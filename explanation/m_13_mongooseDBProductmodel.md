# Mongoose를 이용해 Product Model 구현하기

- 몽고 DB는 schemaless라면서 왜 schema를 생성하는가? 
    : 몽구스가 개발자로 하여금 '데이터' 자체에 집중할 수 있도록 해주는데 스키마가 필요하다.
    또 , 스키마를 생성했다고 해도 title이나 price같은 고정된 요소 없이 새로운 product 스키마를 만들 수 있다.

- _id는 자동으로 생성, 저장된다. 

#### 1. Products 컬렉션에 새로운 Product 추가하기 

``` javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema; // 몽구스로 스키마 생성해주게 하는 method

const productSchema = new Schema({ // new 스키마 생성 
    title: {
        type: String,
        required: true 
    },
    price:{
        type: Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User', // 어떤 model과 relation을 맺을 것인지!
        required:true
    }
});

module.exports = mongoose.model('Product', productSchema);
// 몽구스는 'Product' 모델을 생성해서 productSchema를 넣는다. 
```

- Controller 파일 내에서 ProductAdd 하기
1. new Product 생성후 생성한 product.save() - 몽구스에 의해서 지원되는 메서드

``` javascript
exports.postAddProduct=(req,res,next)=>{ //상품 추가후 list 
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const price=req.body.price;
    const description=req.body.description;
    const product =
     new Product
     ({title: title,
         price:price, 
         description:description, 
         imageUrl:imageUrl ,
         userId:req.user}); // 상품 add할때 userid삽입 --> 나중에 어떤 user가 등록한 상품인지 알 수 있도록!

    product.save() // mongoose는 promise를 반환하지 않지만 then method를 지원함
    .then(result => {
        console.log(result);
        res.redirect('/');
    })
    .catch(err => console.log(err));
};
```

- 데이터 베이스에 가보면 'products'라는 컬렉션이 만들어져 있을 것이다. 이는 몽구스가 아까 우리가 지정해준 모델 name 'Product'를 
소문자로 바꾸고, 뒤에 s를 붙인 것이다.


#### 2. 특정 Product 정보 수정하기
1. get메서드에서는 파라미터로 받은 id를 이용해 findById 메서드를 실행해 해당 product 정보를 view로 넘겨 render 해준다.
2. post에서는 req.body 로부터 받아온 product 정보를 저장해놓늗나.
3. findById 메서드를 이용해 수정할 product를 찾고 해당 product의 정보를 req.body로부터 받아온 정보로 대체한다.
4. 정보를 바꾼 후 해당 product를 save() 해주어 database에 반영되게끔 한다.

```javascript
exports.postEditProduct=(req,res,next)=>{
    const id = req.body.productId;
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const price=req.body.price;
    const description=req.body.description;
   Product.findById(id).then(product=>{
       product.title=title;
       product.price=price;
       product.description=description;
       product.imageUrl=imageUrl;
       product.save();
   })
   .then(result=>{
       console.log('UPDATED PRODUCT!');
       res.redirect('/admin/products');
   } )
   .catch(err=>console.log(err))

}
```

#### 3. 특정 Product 삭제하기
- hidden 으로 받아온 id를 인자로 넣어 deleteOne 메서드를 실행한다.

```javascript
exports.postDeleteProduct=(req,res,next)=>{
    // hidden 으로 id 를 받아온다.
    // product에서 해당 id를 이용해서 데이터에서 정보를 찾은 후 삭제한다.
    const id = req.body.productId;
    Product.deleteOne({'_id':id})
    .then( result => {
        console.log(result);
        res.redirect('/admin/products');
    })
    .catch(err=>{
        console.log.err;
    });
}
```

#### 4. 모든 Product 정보 내보내기 

- find() 메서드는 cursor를 반환하는게 아니라 product 즉, element를 반환한다. 
- .cursor() 를 추가하면 cursor에 접근 할 수 있다.

- **Product.find().populate('userId','name')** : 우리가 레퍼런스로만 가지고 있는 userId 에 해당하는 user의 모든 정보를 가져 올 수 있게 해준다. 해당 코드는 그 정보 중에서도 'name'만을 가져오게 하는 것

- **Product.find().select('title price -_id')** : 특정 데이터만 뽑아오고 싶을 때 사용한다. 여기서는 title price, id만 뽑아오게 하고 이를 결과값으로 return 한다. 

```javascript
exports.getProducts=(req,res,next)=>{
    Product.find() // req.user와 associated된 products만 가져오기 
    .then(products =>{
        console.log(products);
        res.render('admin/products',{ 
            pageTitle:'Admin products',
            prods:products,
            path:'/admin/products'
        });
    })
    .catch(err => console.log(err));
};
```

