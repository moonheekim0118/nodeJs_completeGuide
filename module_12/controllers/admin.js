// product 기준 controller 
const Product = require('../models/product');

// /admin/add-product == > GET
exports.getAddProduct=(req,res,next)=>{ //상품 추가 
    res.render('admin/edit-product', {
        pageTitle:'Add Product',
        path:'/admin/add-prdouct' ,
        editing:false
    });
};

// /adimin/add-product ==> POST 
exports.postAddProduct=(req,res,next)=>{ //상품 추가후 list 
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const price=req.body.price;
    const description=req.body.description;
    const product = new Product(title,price,description,imageUrl);
    product.save().then(result => {
        console.log(result);
        res.redirect('/');
    })
    .catch(err => console.log(err));
};

// /admin/edit-product 
/*
exports.getEditProducts=(req,res,next)=>{
    const editMode= req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodId=req.params.productId;
    // 현재 req.user와 associated된 Product만 가져오기
    // 그 Product중에서도 id가 prodId와 같은 것 가져오기 
    req.user.getProducts({where:{id:prodId}})
   // Product.findByPk(prodId)
    .then(products=>{
        const product= products[0]; 
        if(!products) return res.redirect('/');
        res.render('admin/edit-product', {
            pageTitle:'Edit product',
            path:'/admin/edit-product',
            editing:editMode,
            product:product
        });    
    })
    .catch(err=>{console.log(err)});
};
*/
/*
exports.postEditProduct=(req,res,next)=>{
    const id = req.body.productId;
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const price=req.body.price;
    const description=req.body.description;
    let changeValue ={
        title:title,
        price:price,
        imageUrl:imageUrl,
        description:description
    };
    Product.update(changeValue, {where: {id : id}} )
    .then(result => {
        console.log(result);
        res.redirect('/');
    })
    .catch(err => console.log(err));
}*/
/*
// /admin/products
exports.getProducts=(req,res,next)=>{
    req.user.getProducts()  // req.user와 associated된 products만 가져오기 
    .then(products =>{
        res.render('admin/products',{ 
            pageTitle:'Admin products',
            prods:products,
            path:'/admin/products'
        });
    })
    .catch(err => console.log(err));
};*/

// 삭제 메서드 
/*exports.postDeleteProduct=(req,res,next)=>{
    // hidden 으로 id 를 받아온다.
    // product에서 해당 id를 이용해서 데이터에서 정보를 찾은 후 삭제한다.
    const id = req.body.productId;
    Product.destroy({where:{id:id}})
    .then( result => {
        console.log(result);
        res.redirect('/admin/products');
    })
    .catch(err=>{
        console.log.err;
    });
}*/