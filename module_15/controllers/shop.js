const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');
exports.getIndex=(req,res,next)=>{
    Product.find() // elements 반환 
    .then(products => {
        console.log(products);
        res.render('shop/index',{ 
            pageTitle:'Shop',
            prods:products,
            path:'/',
            isAuthenticated: req.session.isLoggedIn
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
            path:'/products',
            isAuthenticated: req.session.isLoggedIn
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
            pageTitle:products.title,
            isAuthenticated: req.session.isLoggedIn
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

    req.user.populate('cart.items.productId') // user의 cart.items에 있는 것들을 productId기준으로 해당 product 의 정보까지 끌어오기
    //해당 product정보는 productId 아래에 생성된다. 
    .execPopulate() // populate가 promise형으로 안주므로..
    .then(user=>{ // 여기서 반환되는것은 user의 전체정보 
        console.log(user.cart.items); 
        const products=user.cart.items;

        res.render('shop/cart', {
            path:'/cart',
            pageTitle:'my Cart',
            products: products,
            isAuthenticated: req.session.isLoggedIn
        });
    })
    .catch(err=>console.log(err));

};

exports.postDeleteCart=(req,res,next)=>{ // 카트에서 삭제 라우팅 
    const prodId=req.body.productId;
    req.user.deleteFromCart(prodId)
    .then(result=>{
        console.log(result);
        res.redirect('/');
    })
    .catch(err=>console.log(err));
}
exports.getOrders=(req,res,next)=>
{
    Order.find({'user.userid':req.session.user._id})
    .then(order =>{
        res.render('shop/orders', {
            path:'/orders',
            pageTitle:'my Order',
            orders: order,
            isAuthenticated: req.session.isLoggedIn
        });
    })
    .catch(err=>console.log(err));
}

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
                userid:req.user._id
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
