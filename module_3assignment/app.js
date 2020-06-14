const http = require('http');

const routes = require('./routes.js');

const server= http.createServer(routes.handler);

server.listen(3000);