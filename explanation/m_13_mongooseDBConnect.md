# Mongoose이용해서 mongoDB 데이터베이스 연동하기

#### mongoDB 연결하고 admin User 설정하기 

엔트리 파일
``` javascript
const mongoose =require('mongoose'); 
const User = require('./models/user');
mongoose.connect('cluster 주소')
.then(result=>{
    User.findOne(). // args안넘기면 첫번째 데이터 반환 
    then(user=>{
        if(!user){ // 없으면 생성해주기 
            const user = new User({
                name:'Admin',
                email:'admin@amdin',
                cart:{
                    items:[]
                }
            });
            user.save(); // 저장 
        }
    })
    .catch(err=>console.log(err));
    app.listen(3000); // 서버 연결 
}).catch(err=>console.log(err));
```