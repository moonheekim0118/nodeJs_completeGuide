const fs = require('fs');
const requestHandler= (req,res) => {
    const url = req.url;
    const method = req.method;
    if( url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write( '<html>');
        res.write( '<head><title>Enter Button</title> </head>');
        res.write( '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write( '</html>');
        return res.end(); //end를 지점으로 res.write한 것을 클라이언트에게 보낸다. 
    //return 하는 이유는 아래 코드를 실행하지 않고 /message로 post하기 위해서이다.
    //return하지 않으면 message로 post되지 않고 아래 코드가 실행된다.
    }
    if(url ==='/message' && method === 'POST' ){
        const body=[]; 
        req.on('data', (chunk)=>{
            console.log(chunk);
            body.push(chunk); //body에 chunk 데이터를 넣는다. 
        }); // on 은 특정 event를 listen 할 수 있게 해준다. 여기서는 data event가 발생할 때마다 특정 펑션 수행
        return req.on('end' , ()=>{// on에서 읽어와서 body에 저장한 chunk 데이터를 string으로 바꿔서 파싱해준다.
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1]; // = 을기준으로 split해서 message에 넣어준다. 
            fs.writeFileSync('message.txt', message);  // 해당 message를 file에 저장 
            res.statusCode=302;         // 302는 redirection을 위한  status code 
            res.setHeader('Location', '/'); //로케이션은 /으로 지정 -> 다시 redirection 해서 /로 보내기 
            return res.end();
    });

    }
    res.setHeader('Content-Type', 'text/html');
    res.write( '<html>');
    res.write( '<head><title>Hello!</title> </head>');
    res.write( '<body><h1>hello from node js </h1></body>');
    res.write( '</html>');
    return res.end();
}

//module.exports = requestHandler;

//module.exports = { //여러개 저장 가능 
//    handler:requestHandler,
//    someText :'wow'
//};

//module.exports.handler = requestHandler;
//moudle.exports.someText= 'wow';

exports.handler = requestHandler; //shortcut
exports.someText= 'wow';

