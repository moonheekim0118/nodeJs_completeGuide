# Model Moethod 헷갈리는 것 정리 (비동기)

### JSON 파일에 새로운 데이터 save 하기 

1. 데이터가 저장된 JSON 파일을 읽어오고 Array 형태로 파싱하여 저장해준다.
2. 새로운 인스턴스를 해당 Array에 push 해준다.
3. 업데이트된 Array를 다시 JSON 으로 파싱해준 다음 파일에 쓴다.

``` javascript 
class Product{
    constructor(title){
        this.title=title;
    }
    save(){
        const p = path.join(__dirname,'data','product.json'); // 파일에 접근
        fs.readFile(p, (err, fileContent)=>{
            let products =[];
            if(!err) { // 파일을 제대로 읽었다면 
                products =JSON.parse(fileContent); // json파일 parse해서 array에 저장 
            }
            products.push(this); // 현재 새로운 인스턴스를 products에 저장 
            fs.writeFile(p, JSON.stringify(products), (err)=>{ // 다시 JSON 파일로 parse 해서 저장하기 
                console.log(err);
            });
        })
    }
}
```

### 파일에 있는 모든 데이터 불러오기
- 동작되지 않는 코드 
    * why? 비동기 특성에 의해서 fs.readFile 비동기 메서드를 등록만하고 fetchAll() 함수 자체를 끝내버린다. 따라서 아무것도 return 하지 않음 
``` javascript
static fetchAll(){
    const p = path.join(__dirname,'data','product.json');
    fs.readFile(p, (err, fileContent)=>{
        if(err) return [];
        else {
            return JSON.parse(fileContent); 
        }
    })
} 
```

- fix the bug!
1. 콜백 함수를 인자로 받아온다.
2. 우리가 fetchAll 함수를 부른 곳으로 전달하고자 하는 데이터를 콜백 함수의 인자로 전달한다.
3. 그러면 해당 콜백 함수는 받은 데이터를 사용할 수 있다. 

```javascript
static fetchAll(cb){
    const p = path.join(__dirname,'data','product.json');
    fs.readFile(p, (err, fileContent)=>{
        if(err) cb([]);
        else {
            cb(JSON.parse(fileContent)); 
        }
    })
}
```

```javascript
// fetchAll 메서드를 부르는 Controller
Product.fetchAll((products)=>{
    res.render('shop', {
        prods: products
    })
});
```