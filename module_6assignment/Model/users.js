//파일로 보내기 ! 
const userlist= [];
module.exports = class usersList{
    constructor(userName){
        this.userName=userName;
    }
    save(){
        userlist.push(this);
    }
    
    static fatchAll(){
        return userlist;
    }

}