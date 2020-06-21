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
    Product.fetchAll((products)=>{ //이 익명의 콜백함수를 fetchAll에 인자로 넣음, 해당 콜백함수가 실행되면 array가 products자리에 인자로 들어옴.
        res.render('shop',{ 
            pageTitle:'shop',
            prods:products,
            path:'/'
        });
    }); //products array 가져오기 

};