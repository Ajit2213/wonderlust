const express=require("express");
const router=express.Router();




router.get("/",(req,res)=>{
    res.send("its main user");
})


router.get("/:id",(req,res)=>{
    res.send("its user details throwh id");
})

router.post("/main",(req,res)=>{
    res.send("its main post");
})

module.exports =router;