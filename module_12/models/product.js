const getDb = require('../util/database').getDb;

class Product{
    constructor(title, price, description, imageUrl){
        this.title=title;
        this.price=price;
        this.description=description;
        this.imageUrl=imageUrl;
    }
    save(){
        const db = getDb();
        // insert로 넘겨준 인자는 javascript에서 json으로 mongodb가 바꿔준다.
        db.collection('products')
       .insertOne(this)
        .then(result=>{
            console.log(result);
        })
        .catch(err=>console.log); 
        // mongoDb에게 데이터를 삽입할 table을 알려주는 메서드
        // 아직 table이 없으면 바로 create해준다.
        
    }
}

module.exports = Product;