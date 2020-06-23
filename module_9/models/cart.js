const { request } = require("express")

const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const p = path.join(rootDir,'data','cart.json');

module.exports = class Cart{
    
    
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
                updatedProduct.qty=updatedProduct.qyt+1;
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