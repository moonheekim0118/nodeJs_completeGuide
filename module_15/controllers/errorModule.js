
exports=function throwError(err){
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
}
