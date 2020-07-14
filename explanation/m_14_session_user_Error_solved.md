# Storing User data in request flow 
( authentication 적용 X ) 
1.  login 하면 admin user를 찾아서 session에 저장해준다
```javascript
exports.postLogin=(req,res,next)=> {
User.findById("5f0519efbe41f10860a1bac0")
.then(user=>{
	req.session.isLoggedIn = true;
	req.session.user=user;
// session이 제대로 create되고 redirect 하도록 확실히함!
// 특히나 redirect는 session이 생성되기 전에 실행되는 경우가 있음
	req.session.save(err=>{
		console.log(err);
		res.redirect('/');});
	}).catch(err=>console.log(err));
}
```

*하지만 Session.user에 저장된 user data는 Mongoose Model이 아니므로 Mongoose Method를 사용 할 수 없다.*

2. login이 되었다면 session에 저장된 user정보를 req.user에 user모델을 저장해주어 app전체에서 user에 접근할 수 있고 user에 대해 mongoose method를 사용할 수 있게 해준다.

```javascript
app.use((req,res,next)=>{
	if(req.session.user){ // login 되어있을 경우
	User.findById(req.session.user._id) 
	.then(user=>{
	req.user= user;
	next();
	}).catch(err=>console.log(err));
	}
	next();
})
```