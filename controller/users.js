
const User=require("../model/user")
module.exports.renderSignup=(req,res)=>{
    res.render("./users/signup.ejs")
 };



module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        console.log(username,email,password);
        const newUser=new User({email,username});
     const registeruser= await User.register(newUser,password);
     req.login(registeruser,(err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","Welcome to Wanderlust");
    return   res.redirect("/listings");
     })


    }catch(err){
          req.flash("error",err.message)
          res.redirect("/signUp");
    }
}


module.exports.renderlogin=(req,res)=>{
    res.render("./users/login.ejs");
}


module.exports.login=async(req,res)=>{
    req.flash("success","Welcome Back To Wonderlust!")
    let redirecturl=res.locals.redirectUrl || "./listings";
    res.redirect(redirecturl);
    }


    module.exports.logout=(req,res,next)=>{
        req.logout((err)=>{
            if(err){
               return next(err);
            }
            req.flash("success","You are logged out");
            res.redirect("/listings")
        })
    }