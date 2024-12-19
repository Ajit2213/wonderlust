const mongoose=require("mongoose");
const Listing=require("../model/listing.js");
const intial=require("./data.js")
console.log(intial);
console.log(intial.data);

main()
.then(()=>{
    console.log("connected to database")
})
.catch((err)=>{
    console.log(err)
})
// 6740672c68ab2c940fd308cc

async function main(){
    await  mongoose.connect('mongodb://localhost:27017/wanderlust')
  }


  const initDB=async()=>{
    await Listing.deleteMany({});
    intial.data=intial.data.map((obj)=>({
      ...obj,owner:"6740672c68ab2c940fd308cc"
    }))
    // console.log(intial.data);
    await Listing.insertMany(intial.data)
    console.log("working brother")
  }

  initDB();