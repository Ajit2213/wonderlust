const express = require("express");
const router = express.Router();

const stripe = require('stripe')('sk_test_51Q7HaaHJe8uQrcicppvzG39N3EupZACIbJWhpKdcBuvutsLy5mi0dGyKjMvioFBZ3RQHKy7cojBQEZfUFHUmJmAj00AcsLri48');

const { listingschema, reviewSchema } = require("../schema.js");
const wrapAsync = require("../util/wrapAsync");
const ExpressError = require("../util/ExpressError");
const Listing = require("../model/listing"); // Ensure this path is correct

const{islisting,isOwner,validateListing}=require("../middleware.js");
//controller working here
const listingController=require("../controller/listings.js")
//using multer
const multer  = require('multer')
//require storage
const {storage}=require("../cloudConfig.js");
// const upload = multer({ dest: 'uploads/' })
const upload = multer({storage })
// console.log(listingController);

//router-route is also a compact writing a code of same route path...



// Route to render the booking form 
// router.route('/:id/book') .post(wrapAsync(listingController.submitBooking));
 // Route to handle payment 
//  router.route('/:id/confirm') .post(wrapasync(listingController.processPayment));


router.route("/")
.get(wrapAsync(listingController.index))
.post(islisting,  upload.single('listing[image]'),wrapAsync(listingController.createlisting));


router.get('/search',wrapAsync( listingController.searchListings));

//category
router.get('/filter', wrapAsync(listingController.filterListings));



// // Route to render the booking form 
// router.route('/:id/book') .post(wrapasync(listingController.submitBooking));
//  // Route to handle payment 
//  router.route('/:id/confirm') .post(wrapasync(listingController.processPayment));


// router.route('/:id/book') .post(wrapAsync(listingController.submitBooking)); 
// router.route('/:id/confirm') .post(wrapAsync(listingController.processPayment));

// .post(upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// })

// New route
router.get("/new",islisting,wrapAsync(listingController.renderNewForm));

router.route("/:id")
.get( wrapAsync(listingController.showlisting))
.put( islisting,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updatelisting))
.delete(islisting,isOwner, wrapAsync(listingController.destroylisting));



// Route to render the booking form 
// router.route('/:id/book') .post(wrapasync(listingController.submitBooking));
// Edit route
router.get("/:id/edit", islisting,isOwner,wrapAsync(listingController.editlisting));

// Index route
// router.get("/", wrapasync(listingController.index));


// New route
// router.get("/new",islisting,wrapasync(listingController.renderNewForm));

// Show route
// router.get("/:id", wrapasync(listingController.showlisting));



// Create route
// router.post("/",islisting, validateListing, wrapasync(listingController.createlisting));

// Edit route
// router.get("/:id/edit", islisting,isOwner,wrapasync(listingController.editlisting));

// Update route
// router.put("/:id", islisting,isOwner,validateListing, wrapasync(listingController.updatelisting));

// Delete route
// router.delete("/:id",islisting,isOwner, wrapasync(listingController.destroylisting));





// Route to render the booking form 
// router.route('/:id/book') .post(wrapAsync(listingController.submitBooking));
//  // Route to handle payment 
//  router.route('/:id/confirm') .post(wrapAsync(listingController.processPayment));


// Route to render the booking form 
// router.route('/:id/book') .post(wrapasync(listingController.submitBooking));


module.exports = router;
