# nodeJs 공부 저장소 👩🏻‍💻 📚
[udemy nodeJs CompleteGuide](https://www.udemy.com/course/nodejs-the-complete-guide/) 강의 예제 코드 및 과제 저장소 입니다.
+ framework: Node js express.js 
+ template Engine: ejs
+ database : MongoDb, Mongoose 

|파일이름|내용|설명|
|------|---|---|
|module1|Introduction|txt파일에 writeFileSync메서드로 내용을 입력한다|
|module2|Js remind|자바스크립트 promise와 비동기처리 동작을 안다|
|module3|노드JS로 서버 만들기|라우팅의 기초: 인덱스 페이지(path: '/') 에서 form을 통해 text를 가져온 후, post 라우팅(path:'/message')에서 데이터를 읽어 txt파일에 저장한다|
|module3_assignment|서버 만들기 & 라우팅 과제|노드JS로 서버를 만든 후,'/'페이지에서 form을 통해 새로운 유저를 등록 한다. 등록된 유저를 받아오는 페이지'/create-user'는 받아온 데이터를 파싱 해준 후, 유저 리스트를 출력하는 '/users' 페이지로 리다이렉트 해준다|
|module5|Express.js 기초|Express 미들웨어를 이해하고, 미들웨어로 라우팅을 구현한다|
|module5_assignment1|Express.js 서버 구현 과제|기존의 바닐라 노드JS로 작성했던 간단한 웹서버를 Express미들웨어로 구현한다|
|module5_assignment2|라우팅 파일 분할|기존의 app.js 내 미들웨어서 바로 구현했던 라우팅을 routes파일에서 따로 구현한 후, exports해준다|
|module6|pug, handlbars, ejs 템플릿 엔진을 통해 view를 구현 |세가지 템플릿 엔진으로 view를 구현해본다|
|module6_assignment|ejs 변환 과제 및 MVC 패턴 적용|Model View Controler 패턴을 이해하고 기존 파일을 MVC 패턴을 기반으로 분할한다|
|module7|MVC패턴 적용 2 |MVC로 분할한 후 Controller에 Product파일 내용 추가 및 fetch기능 구현한다 |
|module8|기타 기능 추가|Product Edit 및 Delete 버튼을 구현하고 Controller내에서 해당 기능을 구현한다|
|module9|Cart 모델 추가 및 동적 라우팅|class형으로 exports되는 Cart모델 추가하고, class 내부에 모델 관련 메서드(삭제, 추가, 수량수정) 기능을 구현한다. 상품 detail페이지 구현을 위해 상품의 id값을 동적 파라미터로 받아오고 상품의 id 에 따라 다른 페이지를 라우팅한다|
|module10|mySQL-Sequelize를 통해 Model을 데이터베이스로 구현|product, user, cart, order 모델 스키마를 생성하고 Sequelzie 기능을 이용하여 해당 스키마 생성 및 추가 기능을 구현한다.|
|module12|NoSql(MongoDB)를 이용해 Model을 데이터베이스로 구현|몽고db를 이용해 모델을 구현하고, 모델에 대해 수행될 메서드들을 직접 구현해본다|
|module13|Mongoose를 이용해 Model을 데이터베이스로 구현|module12의 내용을 Mongoose로 바꾸어 여러 메서드들을 Mogoose 제공 메서드로 바꾸어 어플리케이션을 구현한다.|
|module14|Session과 Cookie를 구현| Session을 데이이터베이스에 연동하고 해당 Session에 로그인한 회원정보를 삽입한다.|
|module15|Authentication을 구현| 모든 post리퀘스트에 CSRF 토큰을 삽입, 비밀번호 생성및 비교 시 bcrypt 사용|
|module16|구글API를 사용하여 email을 보냄 | 원래 수업에서는 SendGrid사용했으나, 나는 구글  gmail API를 사용함|
|module17|비밀번호 재설정 구현 및 Authorization 추가| 비밀번호 재설정시 난수 토큰을 파라미터로 갖는 path를 이메일로 보내서 비밀번호를 재설정 하게 함, 로그인 하지 않은 유저가 admin 페이지에 접근하지 못하도록 구현|
|module18|express validator를 이용하여 로그인,회원가입, 상품 추가에 validation 구현| 기존 validatior 메서드와 custom validator를 구현하여 input값을 검사|
|module19|500error 페이지를 구현하여 error handling | 데이터베이스 상 문제나 permission 에러 발생 시 stuck 되지 않고 500 error페이지를 띄우게 함|
|module20|File upload 기능을 구현 | Multer패키지를 이용하여 상품 등록 시 이미지 url 대신 이미지 파일을 업로드 하도록 함. 데이터베이스에는 해당 이미지파일의 path를 저장하여 정적으로 접근가능하도록 함|
|module21|Pagination 기능 구현 | mongoose의 기본 메서드 skip, limit을 이용하여 데이터가 여러 페이지에 분산 될 수 있도록 구현함|
|module22|products 삭제 시 Async requests 구현| 기존에 삭제시에는 삭제된 정보를 업데이트 하기 위해 리다이렉션 했으나 이를 개선하여 delete메서드를 이용해 json파일을 res로 보냄| 


