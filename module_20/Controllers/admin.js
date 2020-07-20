const Product = require('../Models/product');
const { validationResult } = require('express-validator/check');
exports.getProducts=(req,res,next)=>{
    //admin으로부터 등록된 products만 보여준다.
    Product.find({userId:req.user._id})
    .then(products=>{
        console.log(products);
        res.render('admin/products',
        {
            products: products,
            pageTitle:'product list from admin',
            path:'/admin/products',
        });
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getAddProduct=(req,res,next)=>{
    //req.user가 특정 product를 등록하는 버튼 
    res.render('admin/add-product', {
        pageTitle: 'ADD NEW PRODUCT',
        path: '/admin/add-product',
        editing:false,
        isError:false,
        ErrorMessage:'',
        validationError:[]
    });
};

exports.postAddProduct=(req,res,next)=>{
    // add product에서 버튼을 누르면 작동 
    // 해당 product를 저장하는 작업 수행
    const title = req.body.title;
    const image =req.file; // 업로드 된 파일 
    const price = req.body.price;
    const description=req.body.description;
    const error = validationResult(req);
    console.log(image);
    if(!error.isEmpty()){
        return res.status(422).render('admin/add-product',{
            path:'/add-product',
            pageTitle:'add product',
            ErrorMessage : error.array()[0].msg,
            validationError: error.array(),
            editing:false,
            isError:true,
            product:{title:title,price:price,description:description}
        })
    }
    if(!image){ // MIME type 불일치
        return res.status(422).render('admin/add-product',{
            path:'/add-product',
            pageTitle:'add product',
            ErrorMessage : '이미지 파일은 JPG , PNG, JPEG 확장자만 가능합니다.',
            validationError: [],
            editing:false,
            isError:true,
            product:{title:title,price:price,description:description}
        })
    }
    const imageUrl = image.path; // db 저장용 
    const product = new Product({
        title:title,
        price:price,
        description:description,
        imageUrl:imageUrl,
        userId:req.user._id
    });
    product.save()
    .then(result=>{
        res.redirect('/');
    }).catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getEditProduct=(req,res,next)=>{
    const productId=req.params.productId; // 파라미터로부터 파싱해온다 
    Product.findById(productId)
    .then(product=>{
        if(product.userId.toString()!==req.user._id.toString()){
            return res.redirect('/admin/products');
        }
        res.render('admin/add-product', {
            pageTitle: 'EDIT PRODUCT',
            path: '/admin/products',
            editing:true,
            isError:false,
            product: product, //해당 product의 정보를 add-product에 보낸다. 
            ErrorMessage:'',
            validationError:[]
        });
    }).catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });

};

exports.postEditProduct=(req,res,next)=>{ 
    const title = req.body.title;           
    const image =req.file;
    const price = req.body.price;
    const description=req.body.description;
    const productId=req.body.productId;
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).render('admin/add-product',{
            pageTitle: 'EDIT PRODUCT',
            path: '/admin/products',
            editing:true,
            isError:true,
            product:{title:title, price:price, description:description , _id:productId},
            ErrorMessage: error.array()[0].msg,
            validationError:error.array()
        });
    }
    Product.findOne({"_id":productId})
    .then(product=>{
        product.title=title;
        if(image){ // image를 새로 업로드 했을 경우에만 image path를 바꾼다.
            product.imageUrl = image.path;
        }
        product.description=description;
        product.price=price;
        product.save();
        res.redirect('/admin/products');
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postDeleteProduct=(req,res,next)=>{
    const id= req.body.prodId; // 삭제할 product의 id
    Product.deleteOne({_id:id, userId:req.user._id})
    .then(result=>{
        res.redirect('/admin/products');
    }).catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

