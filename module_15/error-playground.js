const sum = (a,b) => {
    if(a && b){
    return a+b;}
    else{
        throw new Error('invalid Args');
    }

};

try{
    console.log(sum(1));
}catch(error){
    console.log('error occured');
}