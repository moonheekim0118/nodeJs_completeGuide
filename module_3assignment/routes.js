
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
        
    }
});

exports.handler= requestHandler;