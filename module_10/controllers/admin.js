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
    Product.create({
        title: title,
        price: price,
        imageUrl : imageUrl,
        description : description 
    })
    .then(result => {
        console.log(result);
        res.redirect('/');
    })
    .catch(err => console.log(err));
};

// /admin/edit-product 
exports.getEditProducts=(req,res,next)=>{
    const editMode= req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodId=req.params.productId;
    Product.findByPk(prodId)
    .then(product=>{
        if(!product) return res.redirect('/');
        res.render('admin/edit-product', {
            pageTitle:'Edit product',
            path:'/admin/edit-product',
            editing:editMode,
            product:product
        });    
    })
    .catch(err=>{console.log(err)});
};

exports.postEditProduct=(req,res,next)=>{
    // updated 
    const id = req.body.productId;
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const price=req.body.price;
    const description=req.body.description;
    const updatedproduct = new Product(id,title,imageUrl,description,price); //인스턴스 생성, req.body.title(책이름) 생성자 
    updatedproduct.save(); // products array에 push 
    res.redirect('/admin/products'); //리다이렉트 
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
}

// /admin/products
exports.getProducts=(req,res,next)=>{
    Product.findAll()
    .then(products =>{
        res.render('admin/products',{ 
            pageTitle:'Admin products',
            prods:products,
            path:'/admin/products'
        });
    })
    .catch(err => console.log(err));
};

// 삭제 메서드 
exports.postDeleteProduct=(req,res,next)=>{
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
}