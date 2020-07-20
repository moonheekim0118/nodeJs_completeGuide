const Product = require('../Models/product');
const Order = require('../Models/order');
const fs = require('fs');
const path = require('path');
const ITEMS_PER_PAGE = 1;
exports.getIndex=(req,res,next)=>{
    let page=1;
    if(!req.query.page){  page  = 1; }
    else{ page= +req.query.page; }
    let totalItems; 
    
    Product.find().countDocuments()
    .then(num=>{
        totalItems = num;
        return Product.find()
        .skip((page-1)*ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    })
    .then(products=>{
        res.render('shop/index',{
            pageTitle: 'welcome! ',
            path:'/',
            prods: products,
            currentPage:page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 2 ,
            nextPage : page+1,
            previousPage:page-1,
            lastPage: Math.ceil(totalItems/ ITEMS_PER_PAGE)
        })
    })
    .catch(err=>console.log(err));
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
    let page=1;
    if(!req.query.page){  page  = 1; }
    else{ page= +req.query.page; }
    let totalItems; 
    
    Product.find().countDocuments()
    .then(num=>{
        totalItems = num;
        return Product.find()
        .skip((page-1)*ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    })
    .then(products=>{
        res.render('shop/product-list',{
            pageTitle: 'product list ',
            path:'product list',
            prods: products,
            currentPage:page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 2 ,
            nextPage : page+1,
            previousPage:page-1,
            lastPage: Math.ceil(totalItems/ ITEMS_PER_PAGE)
        })
    })
    .catch(err=>console.log(err));
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

exports.getInvoice=(req,res,next)=>
{
    const invoiceId = req.params.invoiceId;
    if(invoiceId !== req.user._id.toString()){ // 다른 유저가 user Id로 접근하는 것 방지!
        //현재 로그인된 유저 Id와 같은지 확인 
       return  next(new Error('UnAuthorized'));
    }
    console.log(invoiceId);
    const fileName = 'invoice-'+invoiceId+'.pdf';
    const invoicePath = path.join('invoice', fileName);
    // fs.readFile(invoicePath, (err, data)=>{
    //     if(err){
    //       console.log(err);
    //       return next(err);
    //     }
    //     res.setHeader('Content-Type','application/pdf');
    //     res.setHeader('Content-Disposition', 'inline; filename="'+ fileName+ '"');
    //     // inline을 attachment로 바꾸면 다운로드 가능 
    //     res.send(data);
    // });
    const file = fs.createReadStream(invoicePath);
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="'+ fileName+ '"');
    file.pipe(res);
}