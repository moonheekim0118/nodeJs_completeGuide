const Product = require('../models/product');

exports.getIndex=(req,res,next)=>{
    Product.fetchAll((products)=>{ 
        res.render('shop/index',{ 
            pageTitle:'Shop',
            prods:products,
            path:'/'
        });
    }); //products array 가져오 
}

exports.getProducts=(req,res,next)=>{
    Product.fetchAll((products)=>{ 
        res.render('shop/product-list',{ 
            pageTitle:'ALL PRODUCTS',
            prods:products,
            path:'/products'
        });
    }); 
};


exports.getCart=(req,res,next)=>{
    res.render('shop/cart', {
        pageTitle: 'my Cart',
        path : '/cart'
    });
}

exports.getCheckout=(req,res,next)=>{
    res.render('shop/checkout',{
        pateTitle:'checkout',
        path:'/checkout'
    });
}

exports.getOrders=(req,res,next)=>
{
    res.render('shop/orders',{
        pageTitle:'Order',
        path:'/orders'
    });
}