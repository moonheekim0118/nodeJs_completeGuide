
const requestHandler=((req,res)=>{
    const url = req.url;
    const method = req.method;
    if(url === '/'){
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>welcome page</title><head>');
        res.write('<body> <h2>hello! this is my first node js app!<br> thank you for comming </h2> </body>');
        res.write('<form action="/create-user" method="POST"> <input type="text" name="username"><button type="submit">Send</button></form>');
        res.write('</html>');
        return res.end();
    }
    if(url === '/users'){
        res.write('<html>');
        res.write('<head> <title> user list </title></head>');
        res.write('<body> <ul> <li> moonee Kim </li> <li> boogie kim</li> <li> teacher max</li> </ul></body>');
        res.write('</html>');
        return res.end();
    }

    if(url === '/create-user' && method === 'POST'){
        const body =[];
        req.on('data', (chunk)=>{
            body.push(chunk);
        });

        req.on('end',()=>{
            const parsedBody = Buffer.concat(body).toString();
            const user_name = parsedBody.split('=')[1]; // [1]으로 하는 이유는 저장된 형태가 username= 입력데이터 이기 때문이다. 
            console.log(user_name);
            res.statusCode =302;
            res.setHeader('Location', '/users');
            return res.end();  
        })
        //res.statusCode = 302;
        //res.setHeader('Location','/users');
        //res.end() ; or return res.end(); 
        // 이게 해당 코드에서 가능한 이유는 현재 콜백 함수에서 실행되는 내용이, res에 영향을 미치지 않기 때문이다.
        //만약 res에 영향을 미치면 무조건 콜백함수 내부에 들어가있어야 하지만 그게 아니라면 외부에 선언해도 상관없다.
    }
});

exports.handler= requestHandler;