const fs= require('fs');
const path = require('path');
const rootDir = require('../util/path');
const p = path.join(rootDir, 'Data', 'dataStore.json');

const getReadFile = cb =>{
    fs.readFile(p,(err,fileContents)=>{
        if(err){
            cb([]);
        }
        else{
            cb(JSON.parse(fileContents));
        }
    });    
}

module.exports = class usersList{
    constructor(userName){
        this.userName=userName;
    }
    save(){
        getReadFile((userList)=>{
            userList.push(this);
            fs.writeFile(p,JSON.stringify(userList), (err)=>{
                console.log(err);
            });
        });
    }
    
    static fatchAll(cb){
        getReadFile(cb);
    }

}