# Serving Files Statically : 라우터나 미들웨어가 처리하는게 아니라, fileSystem으로 바로 forwarding 하는 것 

- view.html : 이렇게 href에 링크 걸어놓으면 file system에 접근하지 못하여 제대로 찾아가지 못함
```html
<link rel="stylesheet" href="/css/main.css"> 
```

- ../util/path.js  
```javascript
const path = require('path');
module.exports = path.dirname(process.mainModule.filename);
```

- app.js
```javascript
app.use(express.static(path.join(__dirname,'public')));
// __dirname == root folder from now 
// public은 css 파일이 저장된 폴더명 
```
