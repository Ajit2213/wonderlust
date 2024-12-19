
// const express = require("express");
// const router = express.Router();

// const stripe = require('stripe')('sk_test_51Q7HaaHJe8uQrcicppvzG39N3EupZACIbJWhpKdcBuvutsLy5mi0dGyKjMvioFBZ3RQHKy7cojBQEZfUFHUmJmAj00AcsLri48');

// const { listingschema, reviewSchema } = require("../schema.js");
// const wrapasync = require("../util/wrapAsync");
// const ExpressError = require("../util/ExpressError");
// const Listing = require("../model/listing"); // Ensure this path is correct

// const{islisting,isOwner,validateListing}=require("../middleware.js");
// //controller working here
// const listingController=require("../controller/listings.js")
// //using multer



// // Route to render the booking form 
// router.route('/:id/book') .post(wrapasync(listingController.submitBooking));
//  // Route to handle payment 
//  router.route('/:id/confirm') .post(wrapasync(listingController.processPayment));



//  module.exports =router;