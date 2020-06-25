const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex=(req,res,next)=>{
    Product.fetchAll((products)=>{ 
        res.render('shop/index',{ 
            pageTitle:'Shop',
            prods:products,
            path:'/'
        });
    }); //products array 가져오기 
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

exports.getProduct=(req,res,next)=>{
    const prodId = req.params.productId;
    Product.findById(prodId, product=>{
        res.render('shop/product-detail', {
            product: product,
            path:'/products',
            pageTitle:product.title
        })
    })
    
}

exports.postCart=(req,res,next)=>{
    const prodId= req.body.productId;
    Product.findById(prodId,product =>{  //먼저 req로 받은 id에 해당하는 product를 찾아준다.
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
}

exports.getCart=(req,res,next)=>{ //cart에 담겨진 정보 보내기 
    Cart.getCart(cart=>{ //모든 cart에 있는 product 가져오기 
        Product.fetchAll(products=>{ //모든 product정보 가져오기 
            const cartProduct=[]; //cart에있는 product 정보 담을 배열 
            let totalPrice=0;
           if(cart){
            for(prod of products){ 
                const cartProductData= cart.products.find(p => p.id === prod.id);
                //만약 cart에서 product를 찾았다면 
                if(cartProductData){
                    // cartProduct에 해당 product와 qty를 넣어준다. 
                    cartProduct.push({productData: prod, qty: cartProductData.qty});
                }
            }
            totalPrice=cart.totalPrice;
           }
            res.render('shop/cart', {
                path:'/cart',
                pageTitle:'my Cart',
                cart: cartProduct,
                totalPrice: totalPrice
            });
        });
    });
};

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

exports.postDeleteCart=(req,res,next)=>{ // 카트에서 삭제 라우팅 
    const productId=req.body.productId;
    Product.findById(productId, product=>{
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
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
}