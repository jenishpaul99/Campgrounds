express = require("express");
router = express.Router();
passport = require("passport");
User = require("../models/user");
Campground = require("../models/campground.js");

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

router.get("/", function (req, res) {
    Campground.find({}, function (err, camp) {
        if (err) {
            console.log(err);
        } else {
            res.render("../views/campgrounds/campground.ejs", {
                camps: camp,
            });
        }
    });
});

router.get("/register", function (req, res) {
    res.render("../views/register.ejs");
});

router.post("/register", function (req, res) {
    newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, reguser) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/campground");
            });
        }
    });
});

router.get("/login", function (req, res) {
    res.render("../views/login.ejs", {
        message: req.flash("error"),
    });
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        successRedirect: "/campground",
    }),
    function (res, req) {}
);

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Log Out Successful");
    res.redirect("/campground");
});

module.exports = router;
