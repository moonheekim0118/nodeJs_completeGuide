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




## 웹 어플리케이션의 구조 ✨

+ index (path:'/') 사용자에게 등록된 상품을 보여준다 (수정 필요) 
  - add To Cart 버튼 : 해당 상품을 cart에 넣을 수 있다. (path: '/addToCart' method="POST")
  
+ products (path:'/products') 사용자에게 등록된 상품을 보여준다. 
  - add To Cart 버튼: 해당 상품을 cart에 넣을 수 있다. (path: '/addToCart' method="POST")
  - detail 버튼 : 선택된 상품의 id를 파라미터값으로 넘겨주어 등록된 상품의 상세를 보여준다. (path: '/products/productId' method="GET") 
  - back to list 버튼 : /products 페이지로 리다이렉트한다.
+ Cart (path:'/cart') 사용자가 add to cart 버튼을 통해 cart에 등록한 모든 상품을 보여준다
  - Order Now 버튼: Cart에 등록된 모든 상품을 Order 모델로 옮긴다. ( path: '/create-order' method="POST") 
  - Delete 버튼 : Cart에 등록된 모든 상품을 삭제한다. (path:'/cart-delete-item' method="POST")
  
+ Orders (path:'/order') 사용자가 Cart에서 Order Now 를 통해 등록한 모든 상품을 보여준다

+ Add Product (path:'/admin/add-product') 사용자가 상품을 데이터베이스에 등록한다
  - Add Product 버튼 : 사용자가 등록한 정보를 넘겨주어 데이터베이스에 등록한다 (path: 'admin/add-product' method="POST")
  
+ Admin Product (path:'/admin/products') 현재 로그인된 사용자가 등록한 상품만을 보여준다.
  - Edit 버튼 : 해당 상품의 id 를 hidden으로 넘겨주어서 'admin/edit-product' method="GET" 페이지로 보내준다.
  - Delete 버튼: 해당 상품을 데이터베이스에서 삭제한다. (path: 'admin/delete-product' method="POST") 
  
+ Admin Edit Product (path: '/admin/edit-product')
  - Edit 버튼 : 변경한 내용을 데이터베이스에 반영해준다 (path: 'admin/edit-product' method="POST")
  
