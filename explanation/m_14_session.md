# SESSION
- cookie와 같이 client-side를 통해 request에 데이터를 저장하는 방법은 사용자에 의해 수정될 가능성이 있음 
- app내 variable로 선언한다면 모든 user이 같은 정보를 공유하게 됨
- 그러면 어떻게 **하나의 user**의 정보를 app 내부의 모든 request들과 공유할 수 있을까? 


## 세션은 server-side Database 에 데이터를 저장

1. client는 server에게 자신이 속한 session이 무엇인지 알려줘야함 
2. 이 때 자신이 속한 session 판별을 위해 client의 IP를 사용하지 않고 *쿠키*를 사용함
3. 여기서 쿠키는 해당 session의 ID를 가지고 저장하고 있음
4. 쿠키에 저장된 ID는 hashed ID 이기 때문에 서버만 확인 가능

## Implement Session

### initializing the Session Middleware

    npm install --save express-session 

```javascript
const  session = require('express-session');
app.use(session({secret:'my secret', resave:false, saveUninitialized:false ,cookie:{Max-Age=10}}));
```
- resave : false 는 session이 changed되었을 때만 resave함
- saveUninitialized:false 역시 모든 requset마다 saved되지 않도록 함 
- cookie value를 넣어줘서 Expire date를 지정할 수도 있고 넣지 않고 default로 남겨둘 수 있다.
 
 ### Store Session in MongoDB
 

    npm install --save connect-mongodb-session
```javascript
const  session = require('express-session');
const  MongoDBStore = require('connect-mongodb-session')(session);
const  MONGODB_URI='mongodb+srv://<name>:<pw>@cluster0.9j2jo.mongodb.net/shop';
const  store = new  MongoDBStore(
{
uri:MONGODB_URI,  // 연결될 Mongo DB 주소 
collection:'sessions' } // 생성할 Collection 이름 
);
app.use(session({secret:'my secret', resave:false, saveUninitialized:false, store:store}));
// store: store 입력
```

- 이렇게 db에 session을 생성하는 방법을 이용해서 다른 user - data들도 session db에 저장해도 된다. (ex Cart..)