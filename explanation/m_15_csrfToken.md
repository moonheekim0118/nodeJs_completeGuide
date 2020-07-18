# CSRF token
-  권한을 도용당한 인터넷 사용자가 자신의 의지와는 무관하게 공격자가 의도한 행위(수정,삭제,등록 등)를 특정 웹사이트에 요청하게 만드는 방법 
- CSRF token 사용
	- 사용자의 세션에 임의의 난수 값을 저장하고 사용자의 요청마다 해당 난수값을 포함시켜 전송한다.
	- 이후 백엔드에서 요청을 받을 때 마다 세션에 저장된 토큰값과 요청 파라미터에서 전달되는 토큰 값이 같은지 검증하는 방법이다.


how to use CSRF token in our app

    npm install --save csurf
    
    const  csrf = require('csurf');
    
    const  csrfProtection = csrf();
        // after initialize session
    app.use(csrfProtection);


- 모든 view 에서 csrf token을 rendering 할 때 받아와야 한다.
- view에 있는 모든 post request에서 해당 csrf token을 hidden 으로 넘겨주어서 csrf가 valid 하단 것을 알려줘야 한다.

- 이 때 모든 redering에 해당 데이터를 포함 시키는 방법은 넘겨줄 값을 req.locals.keyName 에다 저장하는 것이다

- 따라서 우리는 isLoggedIn 데이터도 req.locals에다 저장할 수 있다.

```javascript
app.use((req,res,next)=>{ /*앞으로 나올 모든 rendering에 아래 데이터 포함시키기*/
res.locals.isAutenticated = req.session.isLoggedIn; // for checking if it's logged in
res.locals.csrfToken= req.csrfToken(); // for protecting our app
next();
})
```

- 그리고 post requsest가 있는 모든 view에다 hidden으로 csrfToken을 넘겨주어야 한다. 이 때 name을_csrf 로 해줘야 한다.

```html
<input  type="hidden"  name="_csrf"  value="<%= csrfToken%>"  >
```


### CSRF Token 외 다른 보안 방법
1. Referer 검증
	- 백엔드에서 request의 referer를 확인하여 domain이 일치하는지 검증

2. Double Sumbit Cookie 검증
	- 웹브라우저의 Same Origin 정책으로 인해 자바스크립트에서 타 도메인의 쿠키값을 확인, 수정하지 못한다는 것을 이용한 방법
	- script단에서 요청시 난수를 생성하여 쿠키에 저장하고 동일한 난수 값을 요청 파라미터에 저장하여 서버에 전송
	- 서버단에서 쿠키의 토큰 값과 파리미터의 토큰값이 일치하는지 검사만 하면 된다.