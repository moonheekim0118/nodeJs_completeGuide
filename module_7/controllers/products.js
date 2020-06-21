// product 기준 controller 
const Product = require('../models/product');
exports.getAddProduct=(req,res,next)=>{
    res.render('admin', {
        pageTitle:'Add Product',
        path:'/admin/add-prdouct' 
    });
};

exports.postAddProduct=(req,res,next)=>{
    const product = new Product(req.body.title); //인스턴스 생성, req.body.title(책이름) 생성자 
    product.save(); // products array에 push 
    res.redirect('/'); // 기본페이지로 리다이렉트 
};

exports.getProducts=(req,res,next)=>{
    const products = Product.fetchAll(); //products array 가져오기 
    res.render('shop',{
        pageTitle:'shop',
        prods:products,
        path:'/'
    });
};