

- backend에서 업로드 된 이미지 저장방식은 이전과 같음 multer 이용하여 이미지를 static 폴더에 저장하고, 해당 이미지 path 추출하여 db에 저장.
- front end에서 업로드 된 이미지를 백엔드에 전달해주기 위해서는 Content-Type이 form 이어야 한다.
  - fromData를 생성해주고 ,해당 fromData에 유저로부더 전달받은 정보를 append해줘서 저장한다.
  - 그리고 그 formData를 body에 삽입하여 유저에게 보낸다.



frontend code 

```javascript
 finishEditHandler = postData => {
    this.setState({
      editLoading: true
    });
    const formData = new FormData(); // formdata 형성 
    formData.append('title', postData.title); // 유저로부터 받은 정보들 저장 
    formData.append('content', postData.content);
    formData.append('image', postData.image);
    let url = 'http://localhost:8080/feed/post'; // post request날릴 주소 
    let method ='POST'; // 메서드 
    fetch(url, {
      method: method,
      body : formData // body에 formData 넣어서 보내준다. 
    })
```





backend code

```javascript
exports.createPost=(req,res,next)=>{
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        throwError('Validation failed');
       } // 인증 에러 검사
    if(!req.file){  // 이미지가 안왔으면 에러 날리기 
        throwError('no image provied');
    }
    const imageUrl = req.file.path.replace("\\" ,"/"); // 저장된 이미지 path 추출 --> db에 string으로 저장
    const title = req.body.title;  
    const content = req.body.content;
    const post = new Post({
        title: title,
        imageUrl:imageUrl,
        content:content,
        creator: {name:'Moonee'}
    });
    post.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message:'post created successfully',
            post: result
        })
    }).catch(err=>{errorHandling(err)});
}

```





