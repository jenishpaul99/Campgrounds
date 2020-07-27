express = require("express");
bodyParser = require("body-parser");
mongoose = require("mongoose");
passport = require("passport");
LocalStrategy = require("passport-local");
User = require("./models/user");
Campground = require("./models/campground");
Comments = require("./models/comments");
methodOverride = require("method-override");
flash = require("connect-flash");
middleware = require("./middleware");
// seedDB = require("E:/code/Node/camping/seeds.js");
// seedDB();

app = express();

// mongoose.connect("mongodb://localhost:27017/yelp_camp", {
//     useNewUrlParser: true,
// });

// Jenish%401999
mongoose.connect('mongodb://jenishpaul99:Jenish%401999@cluster0-shard-00-00-89oaw.mongodb.net:27017,cluster0-shard-00-01-89oaw.mongodb.net:27017,cluster0-shard-00-02-89oaw.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});


app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(
    require("express-session")({
        secret: "sercret",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

campRoutes = require("./routes/campground.js");
userRoutes = require("./routes/comment.js");
indexRoutes = require("./routes/index.js");

app.use(campRoutes);
app.use(indexRoutes);
app.use(userRoutes);

app.listen(process.env.PORT || 3000, function () {
    console.log("Server Started");
});
