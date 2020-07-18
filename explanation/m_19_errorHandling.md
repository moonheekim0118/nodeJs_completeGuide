# Error handling

- 왜 필요한가?
  - databse 에러나 permission problem이 있을 때 catch block에서 그냥 console.log(err) 만 해주면 web page 가 stuck 됨 
  - 이는 not user-friendly!
  - 따라서 server-side error가 발생 시, 500 error를 throw 해주고 500 error page를 보여줘야한다.

```javascript
.catch(err=>{ 
        const error = new Error(err);
        error.httpStatusCode = 500;
       return next(error); 
    });
```

#### 엔트리 파일

```javascript

app.use('/500',errorsController.get500page);
app.use(errorsController.get404page);

app.use((error,req,res,next)=>{ // express js error handling middleware 
    res.redirect('/500'); // next(err)로 보내진 것이 여기로 와서 다시 500으로 리다이렉트 
})

```

- 여기서 주의할 점은 then block 내부 혹은 callback 내부에서 express error handling middleware를 사용하여 error 를 throw하기 위해서는 **next()** 에 담아서 전달해야한다. 
- 그게 아니라면 throw new Error ( 'error') 해줘도 된다. 