# MongoDB로 데이터베이스 연동하기

* keep in mind!
    - 몽고 db에서 id key는 '_id' 로 저장된다.
    - 몽고 db에서 id 는 String 타입이 아니라 ObjectId 타입이다.

- 몽고 DB 연결하기
    1. cluster를 생성해준다.
    2. network access에서 새로운 IP를 추가해준다
    3. cluster가 deploy되면 connect -> using application 을 눌러서 해당 클러스터의 주소를 복사해온다.
    4. mongoDB compass에도 클러스터 주소를 복사해준다

```javascript
const mongodb = require('mongodb'); 
const MongoClient = mongodb.MongoClient;
let _db;
const mongoConnect = (callback) =>{ // for connecting, and storing database 
    MongoClient.connect('cluster 주소')
    .then(client =>{
        console.log('Connected');
        _db = client.db(); // cluster 주소의 <dbname> 으로 연결, 존재하지 않으면 table 생성 
        callback();
    })
    .catch(err=>{
        console.log(err)
        throw err;
    });
};

const getDb = () =>{ // mongoConnect에서 연결된 db로 access할 수 있도록 연결된 db를 리턴해준다
    if(_db) return _db;
    throw 'No database found!';
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
```
엔트리 파일에서는 mongoConnect가 성공하면 서버를 생성한다
```javascript
mongoConnect(() => {
    app.listen(3000);
});
```