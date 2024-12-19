const express=require("express");
const router=express.Router();




router.get("/",(req,res)=>{
    res.send("its post request");
})


router.get("/main",(req,res)=>{
    res.send("its post request main");
})


router.get("/:id",(req,res)=>{
    res.send("its id number")
})


module.exports=router;