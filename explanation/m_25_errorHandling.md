# Error Handling



1. statusCode를 지정해줘야 한다. 

```javascript
exports.createPost=(req,res,next)=>{
    const errors =validationResult(req); // 인증 실패시 에러 생성
    if(!errors.isEmpty()){ // 에러가 있다면 
        const error = new Error('Validation failed'); //새로운 에러 생성 
        error.statusCode=422; //status code 지정 
        throw error; // 에러 던져주기 
       }
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title,
        imageUrl:'images/myImage.jpg',
        content:content,
        creator: {name:'Moonee'}
    });
    post.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message:'post created successfully',
            post: result
        })
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode =500; // statusCode가 없다면 내부적으로 잘못된것이므로 statusCode를 500으로 변경해준다. 
        }
        next(err);
    });
}
```





2. entry 파일에서 해당 에러를 처리해주는 미들웨어를 구현해야한다.
   - 이 때 받아온 에러로부터 statusCode와 message를 추출하여 json 형식으로 보내주도록 한다. 

```javascript

app.use((error,req,res,next)=>{
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message:message}); // error핸들링. json데이터로 보내준다.
})

```

