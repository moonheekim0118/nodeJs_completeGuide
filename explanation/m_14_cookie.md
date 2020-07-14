# COOKIE

 - request가 모두 independent하다면 이것에 대한 대안은 ?

1. Global variable 선언? 이는 모든 user가 같은 데이터에 접근할 수 있으므로 위험함
2. Cookie !  
	+ 쿠키는 한명의 유저 브라우저에 데이터를 저장해주므로 다른 유저에게 영향을 줄 일이 없다.
	+  reuqest와 함께 전송되어, "나 이미 authenticated true임"라고 알려 줄 수 있다.
	+ 쿠키는 browser가 종료될 때까지 모든 requset와 함께 전송된다.

#### 쿠키 저장하기 : Header에 저장 Set-Cookie로 저장 , key-value값 전송 
```javascript
res.setHeader('Set-Cookie', 'loggedIn=true');
```

#### 쿠키 추출하기 
1. req.get에서 Cookie를 가져온다.
2. 쿠키는 각각 세미콜론으로 으로 나누어져 있으므로 세미콜론을 기준으로 split 해준다.
3. (현재 내 브라우저의 경우) 해당 쿠키가 첫번째 쿠키이므로 split 한 데이터에서 [0]번째 쿠키를 가져와 준다
4. trim 메서드로 문자열 좌우 공백을 제거해준다.
5. key - value 값을 나누기 위해서 '='으로 split 해준다.
6. value 값을 추출하기 위해 두번째 데이터를 가져와준다.
7. 해당 데이터가 true 인지 아닌지 저장한다
```javascript
const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1] === 'true';
```


### 문제점 
- developer tool 에서 쿠키를 쉽게 변경 가능하다
- 따라서 쿠키보다는 Session을 사용해야 한다!


### 그럼 쿠키는 언제 쓸 수 있는가?
1. tracking users 
   쿠키는 다른 페이지로도 보내질 수 있기 때문 
2. Control how long an Authenticated session stays active for a user
   ```javascript
   res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10');
   ``` 
	쿠키에 expires date or Max-Age를 정할 수 있기 때문