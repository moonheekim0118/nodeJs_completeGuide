# Resetting Password

- 사용자로 하여금 password를 reset 하게 하려면 어떻게 해야 하는가?
	- 사용자에게 메일을 보낸다.
	- 해당 메일에 링크를 추가하여 보내는데, 그 링크는 파라미터 값으로 **난수 토큰**을 가지고 있어야 한다.
	- 메일을 보낼 때 생성한 토큰을 **resetting을 요청한 유저 모델에 추가하고, 이 때 expires time 도 추가**한다.
	- password를 resetting하는 post request를 구현하고 파라미터 값으로 받아온 토큰 값과 일치하는 유저를 찾는다.
	- 여기서 한 번더, 토큰 값을 비교해주고, 토큰 expires time을 비교해주고 비밀번호를 변경하게 해준다.

```javascript
    const  crypto = require('crypto');
```

#### resetting password link 이메일로 전송하기
1. 토큰 값을 crypto로 생성한다.
2. req.body에 담아온 email과 일치하는 User 모델을 찾는다.
3. 유저가 존재하지 않을 시 /reset으로 리다이렉트 해준다.
4. 유저가 존재할 시 유저 모델에 생성한 토큰과 , 토큰 만기일을 저장해주고 User.save() 해주어 데이터베이스에 반영해준다.
5. 해당 토큰 값을 파라미터값으로 보내는 이메일을 보낸다.
```javascript
exports.postReset = (req,res,next)=>{
    crypto.randomBytes(32, (err, Buffer)=>{ // 토큰 생성하기 
        if(err){
            console.log(err);
            return res.redirect('/reset');
        }
        const token = Buffer.toString('hex');
        User.findOne({email:req.body.email})  // 해당 유저를 찾는다. 
        .then(user=>{
            if(!user){
                req.flash('err', 'no account with that email found');
                return res.redirect('/reset');
            }
            user.resetToken = token;  // 유저 토큰 저장 
            user.resetTokenExpiration = Date.now() + 3600000; // 토큰 만기일 저장 
            return user.save();
        })
        .then(result=>{
            res.redirect('/');
            return sendMail(req.body.email, 'please reset your password' , ` //이메일 보내준다. 
            <p>you requested a password reset</p>
            <p> click this <a href="http://localhost:3000/new-password/${token}">link</a> to set a new password.</p>
            `);
        }).then(reuslt=>{  // https 로 연결하면 오류가 뜬다.
            console.log(reuslt);
        }).catch(err=>console.log(err));
    })
};
```

#### 이메일로 받은 link 페이지 구현
1. 파라미터 값으로 받아온 토큰 값을 추출한다.
2. 해당 토큰 값을 가지고 아직 만기일이 지나지 않은 토큰 값을 가진 User 모델을 찾는다. 
3. 유저 식별을 위해  찾은 user id와 토큰 값을 모두 views에 보내준다.
```javascript
exports.getUpdatePassword = (req,res,next)=>{ // token으로 연결된 페이지 reseting new password 
    const token = req.params.token; // 파라미터에서 토큰 가져오기 
    User.findOne({resetToken:token, resetTokenExpiration:{$gt: Date.now()}}) // 해당 토큰과 일치하는 User 찾기,
    // 토큰이 아직도 유효한지 체크 
    .then(user=>{
        res.render('auth/new-password', {
            path:'/new_password',
            pageTitle: 'reset your password',
            ErrorMessage: req.flash('err'),
            userId: user._id.toString(),
            passwordToken: token
        });
    })
    .catch(err=>console.log(err));
}

```

#### 변경한 password 적용하는 버튼 post request 구현
1. req.body로 담아온 UserId, newPassword 그리고 토큰 값을 추출해 준다.
2. 해당 User Id와 토큰 값이 일치하고 토큰 만기일이 지나지 않은 User 모델을 찾는다.
3. newPassword를 hashedPassword로 바꾸고, 해당 password를 User모델의 Password에 저장한다.
4. User 모델의 토큰값과 토큰 만기일은 undefined 로 바꾸어준다.
5. User.save() 를 하여 데이터 베이스에 반영해준다.
```javascript
exports.postUpdatePassword = (req,res,next) =>{
    const userId = req.body.userId;
    const newPassword= req.body.password;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({resetToken:passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id:userId})
    .then(user=>{
        resetUser=user;
        return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword=>{
        resetUser.password=hashedPassword;
        resetUser.resetToken=undefined;
        resetUser.resetTokenExpiration=undefined;
        return resetUser.save();
    })
    .then(result=>{
        res.redirect('/login');
    })
    .catch(err=>console.log(err));
}
```