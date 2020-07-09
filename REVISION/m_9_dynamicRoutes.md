# Dynamic Routes

- path 에 unique id 추가하기 
```html
<a href="/products/<%= product.id %>" class="btn">Details</a>
```

- routes에서 dynamic routes handling 
- path가 겹치면 뒤에 동적 parameter가 오는 routing이 먼저 와야함
```javascript
    router.get('/products/:productId', shopController.getProductsDetail);
    router.get('/products', shopController,getProducts);
```

- controller에서 parameter 뽑아오기
```javascript
    const productId=req.params.productId; 
    // routing에서 받아온 파라미터 이름으로 뽑아오기 
```