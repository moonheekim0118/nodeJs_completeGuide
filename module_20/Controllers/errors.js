exports.get404error=(req,res,next)=>{
    res.status(404).render('errors/404',
    {pageTitle:'PAGE NOT FOUND',
    path:'' }
    );
}

exports.get500error=(req,res,next)=>{
    res.status(500).render('errors/500',{
    pageTitle:'ERROR FOUND',
    path:''
    }
    )
}