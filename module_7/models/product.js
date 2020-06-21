// product model - 데이터 저장 
const products= [];
module.exports= class Product{
    constructor(title){
        this.title=title;
    }

    save(){
        products.push(this);
    }

    static fetchAll(){
        return products;
    }
}