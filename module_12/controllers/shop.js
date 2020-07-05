const Product = require('../models/product');

exports.getIndex=(req,res,next)=>{
    Product.fetchAll()
    .then(products => {
        res.render('shop/index',{ 
            pageTitle:'Shop',
            prods:products,
            path:'/'
        });
    })
    .catch( err => {console.log(err)});
}

exports.getProducts=(req,res,next)=>{
    Product.fetchAll()
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
    Product.findById(prodId)
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
    const prodId= req.body.productId;
    let fetchedCart;
    let newQuantity=1;
    req.user.getCart()
    .then(cart=>{
        fetchedCart=cart;
        return cart.getProducts({where: {id: prodId}}); // 해당 id의 Product 찾기 
    })
    .then(products =>{
        let product;
        if(products.length > 0){ // product가 있다면 맨 첫번째 value를 꺼내오기 
            product=  products[0];
        }
        if(product){ // 이미 해당 product가 cart에 존재한다면
            // 이전의 quanity를 가져와서 변경해주기 
            const oldQuantity = product.cartItem.quantity;
            newQuantity=oldQuantity+1;
            //return fetchedCart.addProduct(product, {through: {quanity : newQuantity}});
        }
        return Product.findByPk(prodId) // 추가하려는 item을 가져오기 
        /*.then(product=>{
            return fetchedCart.addProduct(product,{ through: { quanity: newQuantity}}); //Cart에 해당 item add 해주기 
        })
        .catch(err=>console.log(err));*/
    })
    .then((product)=>{
        return fetchedCart.addProduct(product, {through: {quantity : newQuantity}});
    })
    .then(()=>{
        res.redirect('/cart');
    })
    .catch(err=>console.log(err));
}

exports.getCart=(req,res,next)=>{ 
    req.user.getCart()  // get.user.cart 로는 접근이 안됨. 
    .then(cart =>{
        // cart와 product가 associated되어있으므로 getProducts 가능 
        return cart.getProducts()
        .then(products=>{
            res.render('shop/cart', {
                path:'/cart',
                pageTitle:'my Cart',
                product: products,
       //         totalPrice: totalPrice
            });
        })
        .catch(err =>console.log(err));
    })
    .catch(err=>console.log(err));

};

exports.getCheckout=(req,res,next)=>{
    res.render('shop/checkout',{
        pateTitle:'checkout',
        path:'/checkout'
    });
}

exports.getOrders=(req,res,next)=>
{
    req.user.getOrders({include: ['products']})  // get.user.cart 로는 접근이 안됨. 
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
    let fetchedCart;
    // cartitem을 item을 order로 옮겨야함
    req.user.getCart()
    .then(cart=>{
        fetchedCart=cart;
        return cart.getProducts();
    })
    .then(products=>{
        req.user.createOrder() // order만들어주기 
        .then(order=>{
            order.addProducts(products.map(product=>{ // 만든 order에 Product 추가 
                product.orderItem = { quantity: product.cartItem.quantity}; // product.orderItem에 추가 
                return product;
            }));
        })
        .catch(err=>console.log(err)); 
        
    })
    .then(result=>{
        return fetchedCart.setProducts(null); // carat에 있는 item 모두 drop 
    })
    .then(result=>{
        res.redirect('/orders');
    })
    .catch(err=>console.log(err));
}
exports.postDeleteCart=(req,res,next)=>{ // 카트에서 삭제 라우팅 
    const prodId=req.body.productId;
    req.user.getCart()
    .then( cart =>{
        return cart.getProducts({where: {id: prodId}});
    })
    .then(products=>{
        let product = products[0];
        return product.cartItem.destroy();
    })
    .then(result=>{
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
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