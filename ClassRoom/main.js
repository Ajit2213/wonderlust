const express=require("express");
const app=express();

var cookieParser = require('cookie-parser')
app.use(cookieParser("secretcode"))
//post is required


app.get("/net",(req,res)=>{
    res.cookie("gym","jaata",{signed:true}),
    res.send("work in range");
})


app.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send(req.signedCookies);
})

const Post=require("./post.js")
const User=require("./user.js")

const port=3000;

// app.get("/nest",(req,res)=>{
//     res.cookie("hello" ,"greet");
//     res.cookie("game" ,"changer");
//     res.send("hello don")
// })


// app.get("/greet",(req,res)=>{
//     let {name="anonymos"}=req.cookies;
//     res.send(`hello ${name}`)
// })

app.get("/",(req,res)=>{
    console.dir(req.cookies);
    res.send("Hi,I am root");
})
app.use("/post",Post);

app.use("/user",User);

app.listen(port,(req,res)=>{
    console.log("its listning");
})

