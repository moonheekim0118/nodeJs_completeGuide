# how Request works

- **redirect는 새로운 request를 만든다.**

```javascript
exports.postLogin=(req,res,next)=>
{
    req.isLoggedIn=true;
    res.redirect('/');
}
```

- 위 코드와 같이 저장한 req.isLoggedIn을 다른 Routing에서 접근하려고 하면 해당 Routing의 새로운 request의 isLoggedIn값을 참조하므로 결과는 false이다.


### 그렇다면 req.user에 admin user를 저장하는 것은?
---

```javascript

app.use((req,res,next)=>{
    User.findById("5f0519efbe41f10860a1bac0") // amdin user의 id 
    .then(user=>{
        req.user=user;
        next();
    })
    .catch(err=>console.log(err));
});
app.use('/admin',adminRoute);
app.use(shopRoute);
app.use(authRoute);
app.use(errorsController.get404page);
```

- 같은 request를 사용하면 언제든지 접근 가능하다.

- 위 코드에서 req.user를 저장하는 미들웨어는 다른 routes보다 먼저 나오고, 이 후의 미들웨어 역시 같은 request cycle에 속한다.
따라서 다른 route handler와 controller가 첫번째 미들웨어에서 request에 저장된 데이터를 그대로 사용할 수 있는 것이다. 