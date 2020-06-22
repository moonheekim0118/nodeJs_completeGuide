// product model - 데이터 저장 
//const products= [];
const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const p = path.join(rootDir,'data','products.json');

const getProductfromFile = cb =>{
    fs.readFile(p,(err,fileContent)=>{
        if(err){
            return cb([]); //해당 콜백함수 인자에 [] 을 넣어서 실행 
        } //이거 끝나고 다음 코드 실행하지 않기 위해 return
        cb(JSON.parse(fileContent)); //해당 콜백함수 인자에 stream 데이터가 parsing된 형태를 넣어서 실행
    });
}

module.exports= class Product{
    constructor(title, imageUrl, description, price){
        this.title=title;
        this.imageUrl=imageUrl;
        this.description=description;
        this.price=price;
    }

    save(){
        this.id = Math.random().toString();
       getProductfromFile(products=>{
        products.push(this); // array에 넣기 
        // js -> json 파싱 (stringfiy)
        fs.writeFile(p, JSON.stringify(products), (err)=>{ //다시 파일에 저장 
            console.log(err); //arrowfunction을 통해서 err check
        });
       });
    }
    
    
    static fetchAll(cb){ //콜백함수를 인자로 받아옴 
        getProductfromFile(cb);
    }

    static findById(id,cb){

        getProductfromFile(products=>{
            const product = products.find(p => p.id === id);
            // p.id === id 가 true이면 현재 보고있는 p (products 중에 하나) 를 return 하여 product 변수에 저장 
            cb(product);
        })
    }
}