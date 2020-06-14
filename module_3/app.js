// 노드 js 서버 만들기 
const http = require('http'); // http 객체를 가져온다. 

const routes = require('./routes.js');

console.log(routes.someText);

const server = http.createServer(routes.handler); //들어오는 모든 request에 대하여 해당 펑션을 실행하도록  //create Server Method가 서버를 반환함 . 따라서 변수에 넣어놓는다.

server.listen(3000);  
// start script
//만든 서버 객체의 listen 메서드를 이용해 원하는 포트, 도메인(여기서는 localhost)에 서버를 연결한다. 
//이를 통해 request를 계속 받게된다. 
