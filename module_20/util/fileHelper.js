const fs = require('fs');

const fileDelete = (filePath) =>{
    fs.unlink(filePath, (err)=> {
        if(err){
            throw (err);
        }
    })
}

exports.fileDelete=fileDelete;