const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
// const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,isValidateListing}=require("../middleware.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })


const listingController=require("../controllers/listings.js");

//router.route() same path is for index route and create route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),isValidateListing,wrapAsync(listingController.createListing));


//router.route() same path is for show route update route and delete route

//new and create route
router.get("/new",isLoggedIn,listingController.rendernewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),isValidateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));
//index route 
// router.get("/", wrapAsync(listingController.index));



//read:Show Route
// router.get("/:id",wrapAsync(listingController.showListing));

//create route
// router.post("/",isLoggedIn,isValidateListing, wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//Update route
// router.put("/:id",isLoggedIn,isOwner,isValidateListing,wrapAsync(listingController.updateListing));

//delete route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports=router
