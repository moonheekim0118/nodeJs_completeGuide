// product model - 데이터 저장 
//const products= [];
const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

module.exports= class Product{
    constructor(title){
        this.title=title;
    }

    save(){
       // products.push(this);
       const p = path.join(rootDir,'data','products.json'); //파일위치 
       fs.readFile(p, (err, fileContent)=>{
        let products=[];   
        if(!err){ //해당 filecontent가 이미 존재한다면  
            products = JSON.parse(fileContent); //json 파일을 js array로 파싱       
        }
        products.push(this); // array에 넣기 
        // js -> json 파싱 (stringfiy)
        fs.writeFile(p, JSON.stringify(products), (err)=>{ //다시 파일에 저장 
            console.log(err); //arrowfunction을 통해서 err check
        });
       });
    }
    
    
    static fetchAll(cb){ //콜백함수를 인자로 받아옴 
        const p = path.join(rootDir,'data','products.json');
        fs.readFile(p,(err,fileContent)=>{
            if(err){
                cb([]); //해당 콜백함수 인자에 [] 을 넣어서 실행 
            }
            cb(JSON.parse(fileContent)); //해당 콜백함수 인자에 stream 데이터가 parsing된 형태를 넣어서 실행
        });
    }
}