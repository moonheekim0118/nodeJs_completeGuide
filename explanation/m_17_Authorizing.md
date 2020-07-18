# Authorizing
- 왜 필요한가?
	- A 사용자가 add한 product를 B 사용자가 삭제하거나 수정 할 수 있는 위험이 있다.
	- 일반 사용자가 관리자에게만 허용된 일을 할 수 있어서는 안된다.

- 어떻게 구현 하는가?
	- admin products 페이지에 보여지는 product정보는 현재 세션이 가지고 있는 user Id 값과 product에 저장된 user Id 값을 비교하여, user Id 값이 일치하는 product만 가져올 수 있다.
	- post request에서도 user Id 값을 비교하면 된다.