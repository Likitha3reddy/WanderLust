if(!process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
// const Listing=require("./models/listing.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");//layouts
// const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
// const {listingSchema, reviewSchema}=require("./schema.js");
// const Review=require("./models/review.js");
const session=require("express-session");
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routers/listing.js");
const reviewRouter=require("./routers/review.js");
const userRouter=require("./routers/user.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

main()
 .then(()=>{
    console.log("connected to db");
 })
 .catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly:true,
    }
};



// app.get("/",(req,res)=>{
//     res.send("Hi! I am the root");
// });
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());//to find the same user request and response 
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld"); //password --helloworld
//     res.send(registeredUser);
// });


//middleware 
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



//review
//post route--/listings/:id/reviews

//check all the routers if it not found it throws this custom class error
app.all("*",(req,res,next)=>{
next(new ExpressError(404,"page not found"));
});

//middleware 
app.use((err,req,res,next)=>{
    //by default
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log(`server is listening to 8080 port`);
});