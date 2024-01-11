const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,isValidateReview,isReviewauthor}=require("../middleware.js");


const reviewController=require("../controllers/reviews.js");
//post route--/listings/:id/reviews
router.post("/",isLoggedIn, isValidateReview,wrapAsync(reviewController.createReview));

//delete route-review
router.delete("/:reviewId",isLoggedIn,isReviewauthor,wrapAsync(reviewController.destroyReview));
  
module.exports=router;