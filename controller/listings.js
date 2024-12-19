const Listing=require("../model/listing")
const ExpressError=require("../util/ExpressError");
const wrapAsync = require("../util/wrapAsync");
module.exports.index=async (req, res, next) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings,query: '' });
}

module.exports.renderNewForm=async(req, res) => {
    res.render("./listings/new.ejs");
};

// const Listing = require('../model/listing');

module.exports.searchListings = async (req, res) => {
    try {
        let query = req.query.query;
        console.log("got it",query)
      if (typeof query !== 'string') { query = ''; }
        const listings = await Listing.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });
        console.log(listings.length);
      
        if(listings.length===0){
            console.log("its not finding the value");
            req.flash("error","This is not available")
          return  res.redirect("/listings");
        }
        res.render('listings/index', { allListings:listings ,query:query});
    } catch (error) {
        console.error(error);
     return   res.redirect('/listings');
    }
};




module.exports.showlisting=async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    console.log(listing);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
   return     res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
}

module.exports.createlisting=async (req, res, next) => {
    console.log('Form Data:', req.body.listing);
    let url=req.file.path;
    let filename=req.file.filename;
    let listing = req.body.listing;
    listing.category=listing.category.toLowerCase();
    // let newListing = new Listing(listing);

    let newListing = new Listing({ 
      ...listing, owner: req.user._id, image: { url, filename }, 
      checkInDate: req.body.checkInDate, 
      checkOutDate: req.body.checkOutDate, 
      numGuests: req.body.numGuests, 
    });

    newListing.owner=req.user._id;
    newListing.image={url,filename}
    console.log(newListing);
    await newListing.save();
    console.log(url,filename)
    req.flash("success","New Listing Created");
   return res.redirect("/listings");
}

module.exports.editlisting=async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
      return  res.redirect("/listings");
    }

    let originalImageurl=listing.image.url;
    // console.log(originalImageurl)
  originalImageurl=originalImageurl.replace("/upload","/upload/h_170,w_200")
    
 return   res.render("./listings/edit.ejs", { listing ,originalImageurl});
}

module.exports.updatelisting=async (req, res, next) => {
    let { id } = req.params;
    
   let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  

 console.log(listing);
   if(typeof req.file!=="undefined"){
       let url=req.file.path;
       let filename=req.file.filename;
       listing.image={url,filename};
       await listing.save();
   }
    req.flash("success"," Listing Updated");
   return res.redirect(`/listings/${id}`);
}



module.exports.destroylisting=async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted");
 return   res.redirect("/listings");
}



// Existing searchListings method...
module.exports.filterListings = async (req, res) => {
  try {
    let category = req.query.category;
    const listings = await Listing.find({
      category: { $regex: category, $options: "i" },
    });
    let error = null;
    let success= null;
    if (listings.length === 0) {
      error = `No listings found for "${category}"`;
      req.flash("error", error);
      return res.redirect("/listings");
    }
    success_msg = `Found ${listings.length} listings for "${category}"`;
    req.flash("success", success);
   return res.render("listings/index", {
      allListings: listings,
      query: category,
    
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong. Please try again.");
 return   res.redirect("/listings");
  }
};









// module.exports.submitBooking = wrapAsync(async (req, res) => { 
//   console.log(req.body)

//   let { id } = req.params;
//    const { checkInDate, checkOutDate, numGuests } = req.body;
//     const listing = await Listing.findById(id); 
//     console.log(listing)
//     console.log(checkInDate, checkOutDate, numGuests);
//     const startDate = new Date(checkInDate); 
//     const endDate = new Date(checkOutDate); 
//     const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)); 
//      const totalAmount = nights * listing.price;  
//      const bookingDetails = { listingId: id, checkInDate: startDate, checkOutDate: endDate, numGuests: parseInt(numGuests, 10), totalAmount, };
//       req.session.bookingDetails = bookingDetails;
//      return res.render("./listings/confirm.ejs", { listing, bookingDetails }); 
//     });


//         module.exports.processPayment = wrapAsync(async (req, res) => { 
//           const stripe = require('stripe')('sk_test_51Q7HaaHJe8uQrcicppvzG39N3EupZACIbJWhpKdcBuvutsLy5mi0dGyKjMvioFBZ3RQHKy7cojBQEZfUFHUmJmAj00AcsLri48'); const { stripeToken } = req.body;
//            const bookingDetails = req.session.bookingDetails;
//             const charge = await stripe.charges.create({ amount: bookingDetails.totalAmount, currency: 'usd', description: `Booking Charge for ${bookingDetails.listingId}`, source: stripeToken, });
//              req.flash('success', 'Booking and payment successful!'); res.redirect(`/listings/${bookingDetails.listingId}`); });





// const Listing = require("../model/listing");
// const wrapAsync = require("../util/wrapAsync");

// module.exports.submitBooking = wrapAsync(async (req, res) => { 
//   console.log(req.body);
  
//   let { id } = req.params;
//   const { checkInDate, checkOutDate, numGuests } = req.body;
//   const listing = await Listing.findById(id); 
//   console.log(listing);
//   console.log(checkInDate, checkOutDate, numGuests);

//   const startDate = new Date(checkInDate);
//   const endDate = new Date(checkOutDate);
//   const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
//   const totalAmount = nights * listing.price;

//   const bookingDetails = {
//     listingId: id,
//     checkInDate: startDate,
//     checkOutDate: endDate,
//     numGuests: parseInt(numGuests, 10),
//     totalAmount,
//   };

//   req.session.bookingDetails = bookingDetails;

//   // Render the confirmation page
//   res.render("./listings/confirm.ejs", { listing, bookingDetails });
// });

// module.exports.processPayment = wrapAsync(async (req, res) => { 
//   const stripe = require('stripe')('YOUR_SECRET_KEY');
//   const { stripeToken } = req.body;
//   const bookingDetails = req.session.bookingDetails;

//   const charge = await stripe.charges.create({ 
//     amount: bookingDetails.totalAmount, 
//     currency: 'usd', 
//     description: `Booking Charge for ${bookingDetails.listingId}`, 
//     source: stripeToken, 
//   });

//   req.flash('success', 'Booking and payment successful!');
//   res.redirect(`/listings/${bookingDetails.listingId}`);
// });

