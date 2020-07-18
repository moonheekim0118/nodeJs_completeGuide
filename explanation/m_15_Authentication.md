# Authentication
- authentication 이란 무엇인가 ? 
	- 사용자들의 id와 password를 입력받아 권한을 인증하는 것
- 어떻게 해야하나 ?
	- 데이터 베이스에 저장된 User 정보와 비교하여 권한이 인증되면 생성된 Session에 해당 User Model 데이터를 저장해준다.
	


## Basic Sign up flow
1. form으로부터 email, password, confirmPassword를 받아온다.
2. User Databse에 해당 email과 중복되는 사용자가 이미 존재하는지 본다.
3. 이미 존재한다면 sign up 실패
4. 존재하지 않는다면 새로운 User Model을 생성해주고 저장한다.

## Encrypt Password
- 주의할 점은 String형으로 받아온 password를 hashed 값으로 encrypt 해주어야 한다. 


        npm install--save becryptjs
        bcrypt.hash(password,12) // 받아온 String password hash값으로 변경

- 마찬가지로 login in 할 때에도, String형으로 받아온 password와 해당 user모델에 저장된 hashed password값을 비교해준다.

```javascript
 bcrypt.hash(password,user.password);
```