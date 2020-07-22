# Multer를 이용하여 웹에 이미지 업로드 기능 추가하기



1. **multer 패키지 설치**	

```javascript
npm install --save multer
```



2. **이미지 업로드 기능을 추가하고자 하는 view에 아래와 같이 추가해준다.**

   - enctype = "multipart/form-data" 
     - enctype은 POST로 파일이나 용량이 큰 데이터를 전송할 때 전송되는 데이터의 인코딩 방식을 지정한다. 전송되는 파일은 데이터 크기가 일정하지 않고 여러 복잡한 정보가 필요하다보니 URL 인코딩 방식 (application/x-www-urlencoded)이 부적합하다. 이 때 "multipart/form-data"로 인코딩 방식을 적용해줌으로써 폼 태그 내에 있는 파일의 데이터를 전송 할 수 있게 된다.  

   - type 이 file 인 input 을 생성해주어 파일을 업로드 받는다.

   ```html
   <form class="product-form" action="/admin/add-product" method="POST" enctype="multipart/form-data"> 
       <div class="form-control">
            <label for="image">Image</label>
            <input type="file"name="image" id="image" >
       </div>
   </form>
   ```





3. **엔트리 파일에 가서 multer 라우터를 추가해준다.**

   - 이 때 multer 프로퍼티를 통해서 저장방식이나 저장하는 파일을 필터링 할 수 있다. 
   - 아래 fileStorage 는 저장 방식 ( 저장되는 공간 , 저장되는 이름) 을 지정하고 있고 fileFilter는 mimetype에 따라서 저장 할 것인지 안할 것인지를 구분 하고 있다.

   ```javascript
   const multer = require('multer');
   const fileStorage = multer.diskStorage({ // 저장 방식
       destination: (req,file,cb)=>{ // 저장되는 곳 지정 
           cb(null, 'images');
       },
       filename: (req,file,cb)=>{ // 저장되는 이름 지정 
           cb(null, file.filename+'-'+file.originalname);
       }
   });
   
   const fileFilter = (req,file,cb) => { // 확장자 필터링 
       if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
           cb(null,true); // 해당 mimetype만 받겠다는 의미 
       }
       else{ // 다른 mimetype은 저장되지 않음 
           cb(null,false);
       }
   };
   app.use(multer({storage :fileStorage, fileFilter:fileFilter}).single('image')); // 라우터 
   ```





4. **업로드 된 이미지를 데이터베이스에 저장하기**

   - 먼저 post request로 담아온 데이터를 추출해준다

   ```javascript
   const image =req.file;
   ```

   ​	이렇게 추출된 파일 데이터는 아래와 같은 형식을 가진다.

   ```javascript
   {
     fieldname: 'image',
     originalname: '72a4daa7ab57cdf086fbb85287c1a7b2.jpg',
     encoding: '7bit',
     mimetype: 'image/jpeg',
     destination: 'images',
     filename: 'undefined-72a4daa7ab57cdf086fbb85287c1a7b2.jpg',
     path: 'images\\undefined-72a4daa7ab57cdf086fbb85287c1a7b2.jpg',
     size: 732453
   }
   ```

   - 이 중에서 데이터베이스에 저장할때 유의미한 데이터는 현재 이미지 리소스가 저장된 곳을 나타내는 path이다. 따라서 받아온 파일을 데이터베이스에 저장할 때에는 path를 추출해서 저장해주도록 한다.

   

   ```javascript
    const imageUrl = image.path; // db 저장용 
       const product = new Product({
           title:title,
           price:price,
           description:description,
           imageUrl:imageUrl,
           userId:req.user._id
       });
   ```

   

   - 이렇게 데이터에 path를 담으면 html 페이지에서 어떻게 해당 이미지를 불러올 수 있을까 ? 이는 CSS파일을 html 파일에 정적으로 제공하는 것과 같은 방식으로 해주면 된다. 즉, 엔트리 파일에서 해당 이미지 폴더를 정적으로 제공해주는 라우팅을 추가해주면 된다. 아래와 같이 추가하면 데이터베이스에 저장된 path를 통해서 이미지가 제대로 전달 된다. 

   ``` javascript
   app.use('/images',express.static(path.join(__dirname,'images')));
   ```

   ​	

