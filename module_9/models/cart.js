const { request } = require("express")

const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const p = path.join(rootDir,'data','cart.json');

module.exports = class Cart{

    static getCart(cb){
        fs.readFile(p,(err,fileContent)=>{
            if(err) {return cb(null);}
            const cart = JSON.parse(fileContent);
            cb(cart);
        })
    }

    static deleteProduct(id, price){ //카트에서 상품 지우는 메서드 , 상품도 지우고 total price도 수정해야함.
        fs.readFile(p,(err,fileContent)=>{
            if(err) return;
            let cart =JSON.parse(fileContent);
            const updatedCart = {...cart};
            const product= updatedCart.products.find(prod => prod.id === id);
            const productQty=product.qty;
            updatedCart.products = updatedCart.products.filter(prod=> prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice- (price* productQty);
            fs.writeFile(p, JSON.stringify(updatedCart),(err)=>{
                console.log(err);
            });
        });
    }


    static addProduct(id, productPrice){
        // 이전 cart를 불러온다.
        fs.readFile(p,(err,fileContent)=>{
            let cart = {products:[], totalPrice:0};
            if(!err){
                cart = JSON.parse(fileContent);
            }
            // 카트를 분석 ==>  기존에 받은 id의 product가 있는지 확인
            const exisitingProductIndex = cart.products.findIndex(prod=> prod.id===id); // 인덱스 찾기 
            const exisitingProduct = cart.products[exisitingProductIndex]; //인덱스에 해당하는 값 
            let updatedProduct;
            if(exisitingProduct){ //있다면 수량을 늘려준다.
                updatedProduct =  {...exisitingProduct}; 
                updatedProduct.qty=updatedProduct.qty+1;
                cart.products = [...cart.products];
                cart.products[exisitingProductIndex]=updatedProduct;
                
            }else{      // 없다면 새로 Add 
            updatedProduct ={ id : id , qty:1};
            cart.products = [...cart.products , updatedProduct]; //기존 products에 추가 
        } 
        cart.totalPrice = cart.totalPrice + +productPrice; // 가격 
        fs.writeFile(p, JSON.stringify(cart),(err)=>{
            console.log(err);
        });
        })
        
    }
}