// product 기준 controller 
const Product = require('../models/product');
const mongodb = require('mongodb');
const {validationResult} = require('express-validator/check');
const mongoose = require('mongoose')
// /admin/add-product == > GET
exports.getAddProduct=(req,res,next)=>{ //상품 추가 
    res.render('admin/edit-product', {
        pageTitle:'Add Product',
        path:'/admin/add-prdouct' ,
        editing:false,
        product:{title:'', imageUrl:'', price:'', description:''},
        ErrorMessage: '',
        validationError : [],
        validating:true
    });
};

// /adimin/add-product ==> POST 
exports.postAddProduct=(req,res,next)=>{ //상품 추가후 list 
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const price=req.body.price;
    const description=req.body.description;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('admin/edit-product',
        { path:'/add-product',
        pageTitle:'add product',
        ErrorMessage: errors.array()[0].msg,
        validationError : errors.array(),
        product:{title:title, imageUrl:imageUrl, price:price, description:description},
        editing:'',
        validating:true
        });
    }
    const product =new Product
     (
         {
        title: title,
         price:price, 
         description:description, 
         imageUrl:imageUrl ,
         userId:req.user}); // 상품 add할때 userid삽입 
    product.save() // mongoose는 promise를 반환하지 않지만 then method를 지원함
    .then(result => {
        console.log(result);
        res.redirect('/');
    })
    .catch(err => {
        const error = new Error(err);
         error.httpStatusCode = 500;
        return next(error);
    });
};


exports.getEditProducts=(req,res,next)=>{
    const editMode= req.query.edit;
    if(!editMode){
        return res.redirect('/');
    };
    const prodId= req.params.productId;
    Product.findById(prodId)
    .then(product=>{
        res.render('admin/edit-product', {
            pageTitle:'Edit product',
            path: '/admin/edit-product',
            editing:editMode,
            product:product,
            validating:false,
            ErrorMessage: '',
            validationError:[],
        });
    })
    .catch(err => {
        const error = new Error(err);
         error.httpStatusCode = 500;
        return next(error);
    });
    // 현재 req.user와 associated된 Product만 가져오기
    // 그 Product중에서도 id가 prodId와 같은 것 가져오기 
};


exports.postEditProduct=(req,res,next)=>{
    const id = req.body.productId;
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const price=req.body.price;
    const description=req.body.description;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('admin/edit-product',
        { path:'/edit-product',
        pageTitle:'edit product',
        ErrorMessage: errors.array()[0].msg,
        validationError : errors.array(),
        product:{title:title, imageUrl:imageUrl, price:price, description:description, _id:id},
        editing:true,
        validating:true
        });
    }
   Product.findById(id).then(product=>{
       if(product.userId.toString()!==req.user._id.toString()){ // 현재 user가 등록한 상품이 아니면 수정 못하도록 함 
           return res.redirect('/'); 
       }
       product.title=title;
       product.price=price;
       product.description=description;
       product.imageUrl=imageUrl;
       product.save().then(result=>{
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
    } )
   })
   .catch(err => {
    const error = new Error(err);
     error.httpStatusCode = 500;
    return next(error);
});

}

// /admin/products
exports.getProducts=(req,res,next)=>{
    Product.find({userId:req.user._id}) // 현재 user가 등록한 상품만 보도록 수정 
    .then(products =>{
        console.log(products);
        res.render('admin/products',{ 
            pageTitle:'Admin products',
            prods:products,
            path:'/admin/products'
        });
    })
    .catch(err => {
        const error = new Error(err);
         error.httpStatusCode = 500;
        return next(error);
    });
};

// 삭제 메서드 
exports.postDeleteProduct=(req,res,next)=>{
    // hidden 으로 id 를 받아온다.
    // product에서 해당 id를 이용해서 데이터에서 정보를 찾은 후 삭제한다.
    const id = req.body.productId;
    Product.deleteOne({'_id':id , 'userId': req.user._id})
    .then( result => {
        console.log(result);
        res.redirect('/admin/products');
    })
    .catch(err => {
        const error = new Error(err);
         error.httpStatusCode = 500;
        return next(error);
    });
}