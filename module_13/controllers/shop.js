const Product = require('../models/product');

exports.getIndex=(req,res,next)=>{
    Product.find() // elements 반환 
    .then(products => {
        console.log(products);
        res.render('shop/index',{ 
            pageTitle:'Shop',
            prods:products,
            path:'/'
        });
    })
    .catch( err => {console.log(err)});
}

exports.getProducts=(req,res,next)=>{
    Product.find()
    .then(products => {
        res.render('shop/product-list',{ 
            pageTitle:'ALL PRODUCTS',
            prods:products,
            path:'/products'
        });
    })
    .catch( err => {console.log(err)});
};

exports.getProduct=(req,res,next)=>{
    const prodId = req.params.productId;
    Product.findById(prodId) // String형의 id를 전달하면 몽구스가 Object Id로 변환해준다
    .then( (products)=>{
        res.render('shop/product-detail', {
            product: products,
            path:'/products',
            pageTitle:products.title
        });
    })
    .catch(err =>
        console.log(err));
}

exports.postCart=(req,res,next)=>{
    const prodId= req.body.productId; // cart에 넣으려는 상품의 id 
    Product.findById(prodId) // 해당 상품 찾기 
    .then(product=>{
        return req.user.addToCart(product); // user - cart에 에 넣기 
    })
    .then(result=>{
        console.log(result);
        res.redirect('/');
    })
    .catch(err=>console.log(err));
}

exports.getCart=(req,res,next)=>{ 
    // 현재 req.user의 cart 내부에 있는 product들의 id들을 가져온다.
    // 해당 id에 맞는 product 정보를 가져온다

    req.user.getCart()
    .then(products =>{
        res.render('shop/cart', {
            path:'/cart',
            pageTitle:'my Cart',
            product: products,
        });
    })
    .catch(err=>console.log(err));

};

exports.postDeleteCart=(req,res,next)=>{ // 카트에서 삭제 라우팅 
    const prodId=req.body.productId;
    req.user.deleteFromCart(prodId)
    .then(result=>{
        console.log(result);
        res.redirect('/cart');
    }
    )
    .catch(err=>console.log(err));
}
exports.getOrders=(req,res,next)=>
{
    req.user.getOrder()  // get.user.cart 로는 접근이 안됨. 
    .then(order =>{
        res.render('shop/orders', {
            path:'/orders',
            pageTitle:'my Order',
            orders: order
        });
    })
    .catch(err=>console.log(err));
}

exports.postCreateOrder=(req,res,next)=>
{
    req.user.addOrder()
    .then(result=>{
        res.redirect('/orders');
    })
    .catch(err=>console.log(err));
}

/*
exports.getCheckout=(req,res,next)=>{
    res.render('shop/checkout',{
        pateTitle:'checkout',
        path:'/checkout'
    });
}


exports.postEditCart=(req,res,next)=> // 수량수정 라우팅 
{
    const productId=req.body.productId;
    const qty = req.body.qty; //수정될 수량 파라미터 
    Product.findById(productId, product=>{
        Cart.editProduct(productId,product.price,qty);
        res.redirect('/cart');
    });
}*/