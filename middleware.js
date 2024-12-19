const Listing = require("./model/listing"); // Ensure this path is correct
const Review = require("./model/review.js");
const { listingschema, reviewSchema } = require("./schema.js");

module.exports.islisting = (req, res, next) => {
  console.log(req.path, "", req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you have to login first");
    return res.redirect("/login");
  }
  next();
};

//why stroe in req.session.redirecturl becoouse passport reset session all information during login so we pass into it will work .
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.curruser._id)) {
    req.flash("error", "you are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingschema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

module.exports.validReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errmsg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.curruser._id)) {
    req.flash("error", "you are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Existing searchListings method...
// module.exports.filterListings = async (req, res) => {
//   try {
//     let category = req.query.category;
//     const listings = await Listing.find({
//       categories: { $regex: category, $options: "i" },
//     });
//     let error = null;
//     let success= null;
//     if (listings.length === 0) {
//       error = `No listings found for "${category}"`;
//       req.flash("error", error);
//       return res.redirect("/listings");
//     }
//     success_msg = `Found ${listings.length} listings for "${category}"`;
//     req.flash("success", success);
//     res.render("listings/index", {
//       allListings: listings,
//       query: category,
    
//     });
//   } catch (error) {
//     console.error(error);
//     req.flash("error", "Something went wrong. Please try again.");
//     res.redirect("/listings");
//   }
// };
