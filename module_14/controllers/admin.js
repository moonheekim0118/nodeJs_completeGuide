// product 기준 controller 
const Product = require('../models/product');
const mongodb = require('mongodb');

// /admin/add-product == > GET
exports.getAddProduct=(req,res,next)=>{ //상품 추가 
    res.render('admin/edit-product', {
        pageTitle:'Add Product',
        path:'/admin/add-prdouct' ,
        editing:false,
        isAuthenticated: req.isLoggedIn
    });
};

// /adimin/add-product ==> POST 
exports.postAddProduct=(req,res,next)=>{ //상품 추가후 list 
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const price=req.body.price;
    const description=req.body.description;
    const product =
     new Product
     (
         {title: title,
         price:price, 
         description:description, 
         imageUrl:imageUrl ,
         userId:req.session.user}); // 상품 add할때 userid삽입 
    product.save() // mongoose는 promise를 반환하지 않지만 then method를 지원함
    .then(result => {
        console.log(result);
        res.redirect('/');
    })
    .catch(err => console.log(err));
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
            isAuthenticated: req.session.isLoggedIn
        });
    })
    .catch(err=>console.log(err));
    // 현재 req.user와 associated된 Product만 가져오기
    // 그 Product중에서도 id가 prodId와 같은 것 가져오기 
};


exports.postEditProduct=(req,res,next)=>{
    const id = req.body.productId;
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const price=req.body.price;
    const description=req.body.description;
   Product.findById(id).then(product=>{
       product.title=title;
       product.price=price;
       product.description=description;
       product.imageUrl=imageUrl;
       product.save();
   })
   .then(result=>{
       console.log('UPDATED PRODUCT!');
       res.redirect('/admin/products');
   } )
   .catch(err=>console.log(err))

}

// /admin/products
exports.getProducts=(req,res,next)=>{
    Product.find() // req.user와 associated된 products만 가져오기 
    /*.select('title price -_id') // 특정 데이터만 뽑아오고 싶을 때 
    .populate('userId', 'name') // userId만가져오는게 아니라, 해당 userId에 해당하는 user의 정보 모두 가져옴 */
    .then(products =>{
        console.log(products);
        res.render('admin/products',{ 
            pageTitle:'Admin products',
            prods:products,
            path:'/admin/products',
            isAuthenticated: req.session.isLoggedIn
        });
    })
    .catch(err => console.log(err));
};

// 삭제 메서드 
exports.postDeleteProduct=(req,res,next)=>{
    // hidden 으로 id 를 받아온다.
    // product에서 해당 id를 이용해서 데이터에서 정보를 찾은 후 삭제한다.
    const id = req.body.productId;
    Product.deleteOne({'_id':id})
    .then( result => {
        console.log(result);
        res.redirect('/admin/products');
    })
    .catch(err=>{
        console.log.err;
    });
}