const express = require("express");
const router = express.Router();
const User=require("../model/user");
const wrapasync = require("../util/wrapAsync");
const passport = require("passport");

const {saveRedirectUrl}=require("../middleware")

const  userController=require("../controller/users");
// console.log(userController);

router.route("/signup")
.get(userController.renderSignup)
.post(wrapasync(userController.signup))

router.route("/login")
.get(userController.renderlogin)
.post( saveRedirectUrl, passport.authenticate('local',    
    { failureRedirect: '/login',failureFlash:true }),
    userController.login
    )

//rendersignup
// router.get("/signup",userController.renderSignup)



//signup
// router.post("/signup",wrapasync(userController.signup))


//render-login

// router.get("/login",userController.renderlogin)

//authentication-login
// router.post("/login", saveRedirectUrl, passport.authenticate('local',    
// { failureRedirect: '/login',failureFlash:true }),
// userController.login
// )


//logout method which is really simple
router.get("/logout",userController.logout)
module.exports=router;