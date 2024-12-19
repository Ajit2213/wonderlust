const express = require("express");
const router = express.Router({mergeParams:true});
//using mergeParams for router so parent inside child data can send no any error
const Reviews=require("../model/review.js");

const { listingschema, reviewSchema } = require("../schema.js");
const wrapasync = require("../util/wrapAsync");
const ExpressError = require("../util/ExpressError");
const Listing = require("../model/listing"); // Ensure this path is correct


const{validReview,islisting,isReviewAuthor}=require("../middleware.js")

const reviewController=require("../controller/reviews.js");

// console.log(reviewController)

router.post("/",islisting,validReview,wrapasync(reviewController.createReviews))
    
    
    // delete review and listing store review
    
    router.delete("/:reviewId",isReviewAuthor,wrapasync(reviewController.destroyReviews))
    


    module.exports=router;