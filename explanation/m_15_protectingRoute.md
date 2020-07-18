# Protecting Route

- login이 되어있지 않을 때 단순히 menu만 볼 수 없는게 아니라 routing 자체를 못하게 해야한다. ( url 접근 금지)

- 이를 위해서 새로운 middleware를 구현함

```javascript
module.exports=(req,res,next)=>{
	if(!req.session.isLoggedIn){
	return  res.redirect('/login');
	}
	next();
}
```

```javascript
const  isAuth= require('../middleware/is-auth');
route.get('/orders', isAuth, shopController.getOrders);
```

1. 로그인이 되어있지 않다면 /login페이지로 redirect해준다.
2. 로그인이 되어있다면 해당 라우팅으로 연결해준다.