# JWT 이용하여 login , signup 구현

- JWT ( Json Web Token)
- REST API에서 backend는 더이상 클라이언트 side와 연결되어 있지 않음
- backend 내 모든 request는 무상태성 (Stateless)을 가지기 때문에 더이상 session, cookie를 이용하여 authentication을 할 수 없음.
- 그래서 사용자가 login 시, backend에서 jwt로 토큰을 만들어서 전달하고, frontend는 전달받은 토큰을 저장해놓음
- 저장한 토큰은 사용자 인증 할 때마다 header에 담겨져서 가게 됨.
- backend에서는 토큰이 담겨져 왔는지 확인함으로써 authentication 구현



```javascript
npm install --save jsonwebtoken
```



- backend에서 토큰 생성해서 보내주기 (login 시)

```javascript
const jwt = require('jsonwebtoken');

// 로그인 라우팅 내부  여기서 loadedUser는 현재 로그인한 유저 
const token  = jwt.sign({email: loadedUser.email, userId: loadedUser._id.toString()},
'thisissecret',{expiresIn: '1h'});
res.status(200).json({token:token, userId:loadedUser._id.toString()}); //토큰 담아서 보내주기 
```



- frontend에서 생성된 토큰 받아서 저장하기

```javascript
  loginHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });
    fetch('http://localhost:8080/auth/login',{
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          email:authData.email,
          password:authData.password
        } )
      })
      .then(res => {
        console.log(res);
        if (res.status === 422) {
          throw new Error('Validation failed.');
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
          throw new Error('Could not authenticate you!');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          isAuth: true,
          token: resData.token, // 토큰 추출 
          authLoading: false,
          userId: resData.userId // userId도 추출 
        });
        localStorage.setItem('token', resData.token); // set 
        localStorage.setItem('userId', resData.userId);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem('expiryDate', expiryDate.toISOString());
        this.setAutoLogout(remainingMilliseconds);
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err
        });
      });
  };
```



- 그리고 이렇게 frontend에 저장된 토큰은, authentication이 필요할 때 header에 담겨져서 보내진다.

```javascript
headers: {
        Authorization:'Bearer ' + this.props.token
      }
```



- 프론트로부터 받아온 토큰을 확인하는 backend 미들웨어 

```javascript
module.exports= (req,res,next)=>{
    const authHeader = req.get('Authorization'); 
    if(!authHeader){ // 헤더가 안왔다면 
        errorFuncs.throwError('not authenticated');
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token,'thisissecret');
    } catch(err){
        err.statusCode =500;
        throw err;
    }
    if(!decodedToken){
        errorFuncs.throwError('not authenticated');
    }
    req.userId= decodedToken.userId;
    next();
}
```

