# Login flow
-  자꾸만  Error: Can't render headers after they are sent to the client. 가  났는데, app.js에서 미들웨어 next 처리를 제대로 안해줘서 그랬음
- if-  else 및 return 처리를 잘해줘서 실행되지 말아야할 코드를 신경써주자

변경 전 코드 
```javascript
app.use((req,res,next)=>{
if(req.session.user){ // login 되어있을 경우
User.findById(req.session.user._id) // req.session에 저장된 user는 mongoDB 모델 자체가 아니라 data이므로
// 몽구스 메서드 사용못함! 따라서 해당 id로 User 데이터베이스를 찾아서 req.user에 넣어주도록 한다.
.then(user=>{
req.user= user;
next();
}).catch(err=>console.log(err));

}
next();
})
```

변경 후 코드 
```javascript
app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    else{ // login 되어있을 경우 
    User.findById(req.session.user._id) // req.session에 저장된 user는 mongoDB 모델 자체가 아니라 data이므로
    // 몽구스 메서드 사용못함! 따라서 해당 id로 User 데이터베이스를 찾아서 req.user에 넣어주도록 한다.
    .then(user=>{
        req.user= user; 
        next();
    }).catch(err=>console.log(err));
}
})

```

### Login flow
1. request로부터 email, password, confirmpassword를 받아온다.
2. User 컬렉션에 email과 일치하는 모델이 있는지 확인한다.
3. 없다면 다시 login 페이지로 redirect 해준다.
4. 있다면 password를 해당 모델user의 password와 bycrypt로 compare 해준다.
5. password가 match 하지 않는다면 login 페이지로 redirect한다.
6. match 한다면 session에 해당 login 정보와 user를 저장하고 save 해준다. 

```javascript
exports.postLogin = (req, res, next) => {
    const email=req.body.email;
    const password=req.body.password;
    User.findOne({email:email})
    .then(user=>{
        if(!user) return res.redirect('/login');
        bcrypt.compare(password, user.password)
        .then(doMatch=>{
            if(!doMatch){
                res.redirect('/login');
            }
            else{
                req.session.isLoggedIn=true;
                req.session.user=user;
                return req.session.save(err=>{
                    console.log(err);
                    res.redirect('/');
                });
            }
        })
        .catch(err=>{
            console.log(err)
        });
    })
    .catch(err=>console.log(err));
  };
```