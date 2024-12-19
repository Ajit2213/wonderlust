if(process.env.NODE_ENV !="production"){
        require('dotenv').config()
}

let secret_key=process.env.STRIPE_SCRET_KEY;
// console.log(secret_key);

let Gemni_key=process.env.GEMNI_API_KEY;
// console.log(Gemni_key);

const stripe = require('stripe')(secret_key);
const express=require("express");
const app=express();

const mongoose=require("mongoose");

const path=require("path");

const methodOverride = require('method-override')
app.use(methodOverride("_method"));


const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.set("view engine","ejs");

app.set("views",path.join(__dirname,"/views"));

app.use(express.static(path.join(__dirname,"public")));

app.use(express.json());

app.use(express.urlencoded({extended:true}));


//

// let listings=require("./views/listings")

const{listingschema,reviewSchema}=require("./schema.js");

const wrapasync=require("./util/wrapAsync");
const ExpressError=require("./util/ExpressError");

//ejs mate for templating 

const ejsMate=require("ejs-mate");

app.engine('ejs', ejsMate);


const {islisting}=require("./middleware.js");
console.log(islisting);

const Listing=require("./model/listing");
// const Reviews=require("./model/review.js");


const listingsRouter=require("./Routes/listing.js");
const reviewsRouter=require("./Routes/review.js");
const userRouter=require("./Routes/user.js");
const bookingRouter=require("./Routes/booking.js");
console.log(Listing);

//authentication-authorization
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./model/user");

const dbUrl=process.env.ATLASDB_URL;


//databases connected
async function main(){
    // await  mongoose.connect('mongodb://localhost:27017/wanderlust')
        await  mongoose.connect(dbUrl);
}

main()
.then(()=>{
        console.log("connected to database")
})
.catch((err)=>{
    console.log(err)
})



// using express-session or connection-flash
//using connect-flash
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("error in mongoose session store",err);
})

const sessionoption={
    store:store,
    secret:process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { 
               expires:Date.now()+7*24*60*60*1000,
               maxAge:7*24*60*60*1000,
               httpOnly:true,
               secure:false,
        }
}




app.use(session(sessionoption))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());







app.listen(8080,()=>{
    console.log("its listingin");
})


app.use((req,res,next)=>{
        res.locals.success=req.flash("success");
        res.locals.error=req.flash("error");
        res.locals.curruser=req.user;
      
        next();
})

app.get("/listings/chatbot",(req,res)=>{
        res.render("./listings/chatbot.ejs")
})


app.use("/listings",listingsRouter);

app.use("/listings/:id/reviews",reviewsRouter);



app.post("/listings/:id/book",islisting, async(req, res) => { 
        console.log(req.body); 
        // res.send("its working")
        let { id } = req.params;
  const { checkInDate, checkOutDate, numGuests } = req.body;
  const listing = await Listing.findById(id); 
  console.log(listing);
  console.log(checkInDate, checkOutDate, numGuests);

  const startDate = new Date(checkInDate);
  const endDate = new Date(checkOutDate);
  const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const totalAmount = nights * listing.price*100;
  console.log(totalAmount)
;
  const bookingDetails = {
    listingId: id,
    checkInDate: startDate,
    checkOutDate: endDate,
    numGuests: parseInt(numGuests, 10),
    totalAmount,
  };

  







  req.session.bookingDetails = bookingDetails;
console.log(req.session.bookingDetails);
  // Render the confirmation page
  


  const session = await stripe.checkout.sessions.create({
         payment_method_types: ['card'], 
         line_items: [{ price_data:
                 { currency: 'inr', 
                        product_data: { name:listing.title, 
                                description:
                                 `${listing.description}\n Number of nights: ${nights} \n Check-In: ${startDate.toDateString()}\n Check-Out: ${endDate.toDateString()}`,
                                
                                
                         }, 
                         unit_amount: totalAmount, }, 
                         quantity: 1, }],
                         mode: 'payment',
                    success_url: `${req.protocol}://${req.get('host')}/listings/${id}/success`,
                     cancel_url: `${req.protocol}://${req.get('host')}/listings/${id}/cancel`, });
                    
                    res.redirect(303, session.url);



  res.render("listings/confirm.ejs", { listing, bookingDetails });


});


// app.post("/listings/:id/confirm",async(req,res)=>{
        
// console.log(req.body)



      
    

//       const { stripeToken } = req.body;
//        const bookingDetails = req.session.bookingDetails; 
//        if (!stripeToken) { 
//         req.flash('error', 'Payment information is missing.');
//          return res.redirect(`/listings/${bookingDetails.listingId}/confirm`); }
//           const charge = await stripe.charges.create({ 
//                 amount: bookingDetails.totalAmount,
//                  currency: 'usd',
//                   description: `Booking Charge for ${bookingDetails.listingId}`, 
//                   source: stripeToken, }); 
//                   req.flash('success', 'Booking and payment successful!');
//                    res.redirect(`/listings/${bookingDetails.listingId}`);

        
// })




app.use("/",userRouter);



app.get("/listings/:id/success",(req,res)=>{
        // res.send("successfully");
       

        res.render("./listings/success.ejs")
})

app.get("/listings/:id/cancel",(req,res)=>{
        res.send("cancefull");
})


// const API_KEY='AIzaSyB0o022uOZXnJO7EKQd9qMepgnjus4gg8I';
// app.post('/api/chat', async (req, res) => { const { message } = req.body; 
// console.log(message);
// try { const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] }), timeout: 10000  }); const contentType = response.headers.get('content-type'); if (!contentType || !contentType.includes('application/json')) { throw new Error('Response not in JSON format'); } const data = await response.json();
// console.log("recived data form api",data);

//  if (data.choices && data.choices.length > 0) { res.json({ reply: data.choices[0].message.content.trim() }); } else { res.status(500).send('No response from the chatbot API'); } } catch (error) { console.error('Error:', error.message); res.status(500).send(`Error communicating with the chatbot API: ${error.message}`); } });


 const API_KEY = Gemni_key;

 app.post('/api/chat', async (req, res) => {
     const { message } = req.body;
     console.log(message);
 
     try {
         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({
                 contents: [{ parts: [{ text: message }] }]
             }),
             timeout: 10000
         });
 
         const contentType = response.headers.get('content-type');
         if (!contentType || !contentType.includes('application/json')) {
             throw new Error('Response not in JSON format');
         }
 
         const data = await response.json();
         console.log("Received data from API:", data.candidates[0].content.parts[0].text.trim());
 
         if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
             res.json(data.candidates[0].content.parts[0].text.trim());
         } else {
             res.status(500).send('No response from the chatbot API');
         }
     } catch (error) {
         console.error('Error:', error.message);
         res.status(500).send(`Error communicating with the chatbot API: ${error.message}`);
     }
 });


app.all("*",(req,res,next)=>{
        next(new ExpressError(404,"Page not Found"));
    })
    
    app.use((err,req,res,next)=>{
       let{status=500,message="something went wrong"}=err;
    
      res.status(status).render("./listings/error.ejs",{message})
    });









































//     module.exports.updatelisting = async (req, res, next) => { try { let { id } = req.params; let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });  if (typeof req.file !== "undefined") { let url = req.file.path; let filename = req.file.filename; listing.image = { url, filename }; await listing.save(); } req.flash("success", "Listing Updated"); res.redirect(`/listings/${id}`); } catch (error) { console.error(error); next(new ExpressError(500, "Internal Server Error")); } };
















































































































































































































































































// app.get("/",async (req,res)=>{
// //   let samplelisting=new Listing({
// //     title:"new Villa",
// //     description:"new villa in the mountains",
// //     price:1000,
// //     location:"mountains",
// //   country:"india"
// //   })
// //  await samplelisting.save()
// //   .then((res)=>{
// //     console.log(res)
// //   }).catch((err)=>{
// //     console.log(err);
// //   })
//   res.send("its working");
// })

//delete




// const validateListing=(req,res,next)=>{
//         let {error}=listingschema.validate(req.body);
//         console.log(error);
//         if(error){
//                 let errmsg=error.details.map((e)=>e.message).join(",");
//                 throw new ExpressError(400,errmsg);
//         }else{
//                 next();
//         }
// }

// const validReview=(req,res,next)=>{
//         let {error}=reviewSchema.validate(req.body);
//         console.log(error);
//         if(error){
//                 let errmsg=error.details.map((e)=>e.message).join(",");
//                 throw new ExpressError(400,errmsg);
//         }else{
//                 next();
//         }
// }


// app.delete("/listings/:id",wrapasync(async(req,res,next)=>{
    

//         let {id}=req.params;
//        await Listing.findByIdAndDelete(id);
//         res.redirect("/listings")
   
// }))


//update

// app.put("/listings/:id",validateListing,wrapasync(async(req,res,next)=>{
    

//         let {id}=req.params;
//        await Listing.findByIdAndUpdate(id,{...req.body.listing})
    
//        res.redirect(`/listings/${id}`)
    

// }))



//edit

// app.get("/listings/:id/edit",wrapasync(async(req,res,next)=>{
    

//         let {id}=req.params;
//        let listing=await Listing.findById(id);
    
//         res.render("./listings/edit.ejs",{listing})
    
// }))




//new route
// app.get("/listings/new",wrapasync(async(req,res)=>{
//         console.log("its hitting");
//        await res.render("./listings/new.ejs");
// }))






//create route
// app.post("/listings",validateListing,wrapasync(async(req,res,next)=>{
//         let listing=req.body.listing;

//         console.log(req.body);
//         console.log(listing);
//         let newListing= new Listing(listing);
        
       
//        await newListing.save();
//        res.redirect("/listings") 

// }))




//show route


// app.get("/listings/:id",wrapasync(async(req,res,next)=>{
//         let {id}=req.params;
//         const listing=await Listing.findById(id).populate("reviews");
      
//         res.render("./listings/show.ejs",{listing});
        
// }))


// index route
// app.get("/listings",wrapasync(async (req,res,next)=>{
//         let allListings=await Listing.find();
    
//         res.render("./listings/index.ejs",{allListings});
// }))



// app.use("/listings",listings);

// app.use("/listings/:id/reviews",reviews);

//reviews -post route

// app.post("/listings/:id/reviews",validReview,wrapasync(async(req,res)=>{
// let listing=await Listing.findById(req.params.id);

// let newReview=new Reviews(req.body.review);

// listing.reviews.push(newReview);
// await newReview.save();
// await listing.save();


// res.redirect(`/listings/${listing._id}`)
// }))


// delete review and listing store review

// app.delete("/listings/:id/reviews/:reviewId",wrapasync(async (req,res)=>{
//                   let{id,reviewId}=req.params;
//                   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
//                   await Reviews.findByIdAndDelete(reviewId);
                  
//                   res.redirect(`/listings/${id}`)
// }))



//Backend Error Handling

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not Found"));
// })

// app.use((err,req,res,next)=>{
//    let{status=500,message="something went wrong"}=err;

//   res.status(status).render("./listings/error.ejs",{message})
// });