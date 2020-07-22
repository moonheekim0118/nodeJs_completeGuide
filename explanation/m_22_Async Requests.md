# Async Requests

- 특정 상품을 삭제할 경우 이전까지는 전체 페이지를 다시 리로드했음
  - 하지만 이는 너무 비효율적이므로 현재 페이지에서 해당 부분만 수정하는 방향으로 바꾸어 보도록 한다.

1. 먼저 post 리퀘스트를 보내는 폼에서 해당 button type을 submit이 아니라 button으로 변경해준다. 그리고 해당 button을 누르면 특정 js 펑션이 실행되도록 한다. 여기서 this를 넘겨줌으로써 hidden input에 접근할 수 있도록 한다. 

```html
<input  type="hidden"  name="_csrf"  value="<%= csrfToken%>"  >
<input type="hidden" value="<%= prod.id %>" name="prodId">
button class="btn" type="button" onclick="deleteProduct(this)">Delete</button>
```

2. js 펑션은 아래와 같다.
   1. hidden으로 받아온 값들을 저장한다.
   2. 해당 상품이 delete되면 화면에서도 삭제해야하므로 ,  해당 button view에서 가장 가까운 article을 저장해놓는다.
   3. /admin/products 로 fetch하는데 삭제할 상품의 id를 파라미터로 전달해서 보낸다.
   4. method는 DELETE로 하고 (not post!) header에 csrf-token을 담아서 보내준다.
   5. 결과가 오고 정상적으로 삭제되었다면, html코드에서 해당 상품이 차지한 공간 자체를 삭제해준다. 

```javascript
const deleteProduct=(btn)=>{
    const prodId = btn.parentNode.querySelector('[name=prodId]').value; //
    const csrf=btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement = btn.closest('article');
    fetch('/admin/products/'+prodId, { // 라우팅 
        method:'DELETE',
        headers:{
            'csrf-token':csrf
        }
    }).then(result=>{
        return result.json();
    }).then(data=>{
        console.log(data);
        productElement.parentNode.removeChild(productElement); // 해당 상품이 차지한 공간 자체 삭제 
    }).catch(err=>console.log(err));
      
}
```

3. 이를 받는 라우터는 아래와 같이 구현된다.

   	1. 먼저 라우팅 자체를 delete으로 받는다.
    	2. 데이터베이스에서 해당 상품을 삭제하는 과정은 이전과 같다.
    	3. 대신 res로 redirect나 render를 해주는게 아니라 json을 보낸다. 여기서는 성공여부를 알려주는 메시지만 간단히 보내도록 한다.

   ```javascript
   router.delete('/products/:productId', AuthRouting.sellerCheck,AdminController.postDeleteProduct);
   ```

   ```javascript
   exports.postDeleteProduct=(req,res,next)=>{
       const id= req.params.productId;
       Product.findById(id)
       .then(product=>{
           if(!product){
               throw new Error('there is no product');
           }
           fileHelper.fileDelete(product.imageUrl); // 이미지 삭제
           return Product.deleteOne({_id:id}); // 상품 삭제 
       })
       .then(result=>{ // 성공시 
           res.status(200).json({message:'Succed'});
       })
       .catch(err=>{ //실패시 
           res.status(500).json({message:'Fail!'});
       })
   };
   
   ```

   