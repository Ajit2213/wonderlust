const Listing=require("../model/listing")
const Reviews=require("../model/review")

module.exports.createReviews=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    
    let newReview=new Reviews(req.body.review);
    
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created");
    // console.log("new Review Saved");
    res.redirect(`/listings/${listing._id}`)
    }



    module.exports.destroyReviews=async (req,res)=>{
        let{id,reviewId}=req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
        await Reviews.findByIdAndDelete(reviewId);
        req.flash("success"," Review Deleted");
        res.redirect(`/listings/${id}`)
};