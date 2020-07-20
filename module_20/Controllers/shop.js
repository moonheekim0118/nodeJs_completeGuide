const Product = require('../Models/product');
const Order = require('../Models/order');
const product = require('../Models/product');
exports.getIndex=(req,res,next)=>{
    Product.find()
    .then(products=>{
        res.render('shop/index',{
            pageTitle:'welcome',
            path:'/',
            prods: products
        });
    })
    .catch(err =>console.log(err));
}

exports.getProductDetail=(req,res,next)=>{
    const productId= req.params.productId;
    console.log(productId);
    Product.findById(productId)
    .then(product=>{
        res.render('shop/product-detail', 
        {
            product:product,
            pageTitle:'DETAIL',
            path:'/admin/products'
        })
    })
    .catch(err=>console.log(err));
}

exports.getProducts=(req,res,next)=>{
    Product.find()
    .then(products=>{
        res.render('shop/product-list',{
            pageTitle:'products',
            path:'/products',
            prods: products
        });
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getCart=(req,res,next)=>{
    if(req.user){ // 로그인 된 경우 
        req.user.renewCart().then(result=>{
            console.log(result);
            req.user.populate('cart.items.productId')
            .execPopulate()
            .then(user=>{
                const products = user.cart.items;
                res.render('shop/cart', {
                    path:'/cart',
                    pageTitle:'my Cart',
                    products:products
                })
            })
            .catch(err=>{
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
        });
    }
    else{ //로그인 되지 않은 경우
        res.render('shop/cart', {
            path:'/cart',
            pageTitle: 'my Cart',
            products:[]
        })
    }
}

exports.postAddToCart=(req,res,next)=>{
    if(req.user){
        const productId=req.body.productId;
        req.user.addToCart(productId)
       .then(result=>{
        res.redirect('/cart');
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
    }
    else{
        res.redirect('/login');
    }
}

// 카트에서 product 삭제 
exports.postDeleteCart=(req,res,next)=>{
    const productId=req.body.productId;
    req.user.removeFromCart(productId)
    .then(result=>{
        res.redirect('/cart');
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
    
}

exports.getOrder=(req,res,next)=>{ // Order페이지 띄우기 
    // order가 없는 경우에도 renewOrder를 실행하면 null 에러가 뜬다.
    // 따라서 order가 있는 경우와 없는 경우를 나누어주었다. 
    // 추후 refectoring 필요 
    if(req.user){
        Order.findOne({'user.userId':req.user._id})
        .then(order=>{
            if(order){
                order.renewOrder()
                .then(order=>{
                    order.populate('products.items.productId')
                    .execPopulate()
                    .then(orderObject=>{
                        const items = orderObject.products.items;
                        res.render('shop/orders',{
                            path:'/orders',
                            pageTitle:'my Orders',
                            orders:items
                        })
                    })
                    .catch(err=>console.log(err));
                })
                .catch(err=>console.log(err));
            }
            else{ // order가 없는 경우 
                res.render('shop/orders',{
                    path:'/orders',
                    pageTitle:'my Orders',
                    orders:[]
                })
            }
        })
        .catch(err=>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    }
    else{
        res.redirect('/login'); // 로그인 안되어있다면
    }
}

exports.postAddToOrder=(req,res,next)=>{ // Cart에서 Order로 추가 
    Order.findOne({'user.userId':req.user._id})
    .then(order=>{
        if(!order){
            order=new Order({ // 해당  user의 order가 없다면 생성해주기 
                products: {items:[]},
                user:{userId:req.user._id}
            });
        }
        order.addOrder(req.user._id)
        .then(result=>{
            req.user.clearCart(); // 카트 비우기 
            res.redirect('/orders');
        })
    }).catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

// 특정 order 삭제하기 
// 'many'이면..get 할때 뒤에 s를 붙여야한다.
exports.postDeleteOrder=(req,res,next)=>{
    const product_id=req.body.productId;
    Order.findOne({'user.userId':req.user._id})
    .then(order=>{
        order.removeOrder(product_id)
        .then(result=>{
            res.redirect('/orders');
        })
    }).catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}