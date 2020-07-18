# Validation

- why we need validation?
  -  input에 들어오는 데이터를 필터링 하기 위함
  - 아무 데이터나 받을 수 없도록 조치를 취하기 위해서
- how ?
  - express-validator와 같은 third-party package 를 이용
  - routes file에 controller로 넘어가기 전에 validator 메서드들을 먼저 거쳐서 가면 된다. 

```javascript
npm install --save express-validator
```

#### Route file 

```javascript
const {  body } = require('express-validator/check'); // check function 을 추가해준다. 
//여기서 body를 넣은 이유는 , body로부터 들어오는 정보를 check 하겠다는 것
// 따라서 header, cookie 도 가능 하다.
```

#### login route validator 

```javascript
route.post('/login',
[
    body('email') // body에 들어온 정보중에 email 
    .isEmail().withMessage('Please Enter a valid email') 
    .custom((value, {req})=>{ // custom validator 
        return User.findOne({email:value})
        .then(userDoc=>{
            if(!userDoc){
                return Promise.reject('Email is wrong');
            };
        });
    })
    .normalizeEmail() // 대문자로 들어와도 소문자로 변경 
    ,
    body('password') 
    .isLength({min:6, max:12}).withMessage('Password length should be 6~12')
    .isAlphanumeric().withMessage('only numbers and characters are allowed')
    .trim() // whiteSpace 지워주기 
]
,authController.postLogin);
```

#### login controller validator

- 라우팅에서 받은 error 메시지를 처리해줘야 한다.

```javascript
const {validationResult} = require('express-validator/check');
exports.postLogin = (req, res, next) => {
    const email=req.body.email;
    const password=req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()){ // error 가 있다면 
        return res.status(422).render('auth/login', // 다시 login 으로 render 해주기 
        { path:'/login',
        pageTitle:'login',
        ErrorMessage: errors.array()[0].msg, // custom 에러 메시지 전달 
        oldInput: {email: email, password:password}, // view에 old input 띄우주기 위함 
        validationError: errors.array() // 어떤 종류의 error인지 알려주기 위함 
        });
    }
    // 생략 
  };


```

