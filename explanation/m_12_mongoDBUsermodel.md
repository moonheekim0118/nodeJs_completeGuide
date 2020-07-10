# MongoDB를 이용해 User Model 구현하기

- cart는 User model에 속해있다
- Order는 따로 Model파일을 만들어주지 않고, User model에서 Order컬렉션 add와 remove를 구현해준다
- 현재 어플리케이션에서는 서버 생성 시 , 먼저 Databse에서 admin 유저를 만들고 해당 유저를 req.user에 저장해준다. 그럼으로써 어플리케이션 전체에서 admin user에 접근할 수 있게 해주고, 해당 user를 통해 상품 등록 및 삭제 수정을 해줄 수 있도록 한다.

### User Model
#### 1.생성과 저장

```javascript
class User{
    constructor(username,email,id,cart){
        this.name=username;
        this.email=email;
        this._id = new mongodb.ObjectId(id);
        this.cart=cart; // {items:[]} 형태로 저장된다 
    }
    save(){
        const db = getDb();
        let dbOp =db.collection('users').insertOne(this);
        return dpOp
        .then(user=>{
            console.log(user);
        })
        .catch(err=>console.log(err));
    }

```

#### 2. ID로 특정 User찾기

``` javascript
    static findById(userId){
        const db = getDb();
        return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)})
        // findOne은 cursor형태가 아니라 바로 element를 보낸다. 
        .then(user=>{
            return user;
        })
        .catch(err=>console.log(err));
    }
```


#### 3.엔트리 파일에서 서버 연동시 admin 유저 만들기
- 여기서 new User로 만드는 이유는 그냥 user로 만들면 user 모델 내부 메서드에 접근이 불가능하기 때문이다.
- new USer로 만든 후에 메서드를 쓸 때 마다 해당 id를 가진 user 컬렉션 db를 업데이트 시켜줌으로써 db와 연동된다.

``` javascript
app.use((req,res,next)=>{
    User.findById("5f01694e0857cd31cd69f86a") // amdin user의 id 
    .then(user=>{
        req.user=new User(user.name, user.email, user._id, user.cart); // req.user에 저장 
        next();
    })
    .catch(err=>console.log(err));
});
```