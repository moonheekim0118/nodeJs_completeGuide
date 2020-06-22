// product 기준 controller 
const Product = require('../models/product');

// /admin/add-product == > GET
exports.getAddProduct=(req,res,next)=>{ //상품 추가 
    res.render('admin/add-product', {
        pageTitle:'Add Product',
        path:'/admin/add-prdouct' 
    });
};

// /adimin/add-product ==> POST 
exports.postAddProduct=(req,res,next)=>{ //상품 추가후 list 
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const price=req.body.price;
    const description=req.body.description;
    const product = new Product(title,imageUrl,description,price); //인스턴스 생성, req.body.title(책이름) 생성자 
    product.save(); // products array에 push 
    res.redirect('/products'); //리다이렉트 
};

// /admin/edit-product 
exports.getEditProducts=(req,res,next)=>{
    res.render('admin/edit-product', {
        pageTitle:'edit product',
        path:'/admin/edit-product'
    });    
};

// /admin/products
exports.getProducts=(req,res,next)=>{
    Product.fetchAll((products)=>{ 
        res.render('admin/products',{ 
            pageTitle:'Admin products',
            prods:products,
            path:'/admin/products'
        });
    }); 
};

