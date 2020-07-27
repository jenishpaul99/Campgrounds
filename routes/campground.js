express = require("express");
router = express.Router();
Campground = require("../models/campground.js");
middleware = require("../middleware");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    },
    {
        name: "Canyon Floor",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    },
];

router.get("/campground", function (req, res) {
    Campground.find({}, function (err, camp) {
        if (err) {
            console.log(err);
        } else {
            res.render(
                "../views/campgrounds/campground.ejs",
                { camps: camp }
            );
        }
    });
});

router.post("/campground", middleware.isLoggedIn, function (req, res) {
    newcamp = req.body.newcamp;
    newimage = req.body.newimage;
    newdesc = req.body.desc;
    newprice=req.body.price;
    console.log(newimage);
    newobject = {
        name: newcamp,
        image: newimage,
        description: newdesc,
        price: newprice,
        author: { id: req.user._id, username: req.user.username },
    };
    console.log(newobject);
    // camps.push(newobject);
    Campground.create(newobject, function (err, saved) {
        if (err) {
            console.log(err);
        } else {
            console.log("SAVED");
            console.log(saved);
        }
    });
    res.redirect("/campground");
});

router.get("/campground/new", middleware.isLoggedIn, function (req, res) {
    res.render("../views/campgrounds/new.ejs");
});

router.get(
    "/campground/:id/edit",
    middleware.checkCampgroundOwnership,
    function (req, res) {
        Campground.findById(req.params.id, function (err, camp) {
            if (err) {
                console.log(err);
            } else {
                res.render("../views/campgrounds/edit.ejs", {
                    camp: camp,
                });
            }
        });
    }
);

router.put("/campground/:id", middleware.checkCampgroundOwnership, function (
    req,
    res
) {
    Campground.findByIdAndUpdate(req.params.id, req.body.updated, function (
        err,
        camp
    ) {
        if (err) {
            res.redirect("/campground");
        } else {
            console.log(camp);
            res.redirect("/campground/" + req.params.id);
        }
    });
});

router.delete("/campground/:id", middleware.checkCampgroundOwnership, function (
    req,
    res
) {
    Campground.findByIdAndRemove(req.params.id, function (err, camp) {
        if (err) {
            console.log(err);
        } else {
            console.log("deleted");
            res.redirect("/campground/");
        }
    });
});

router.get("/campground/:id", function (req, res) {
    Campground.findById(req.params.id)
        .populate("comments")
        .exec(function (err, returnedCamp) {
            if (err) {
                console.log(err);
            } else {
                console.log(returnedCamp);
                res.render("../views/campgrounds/show.ejs", {
                    camp: returnedCamp,
                });
            }
        });
});

module.exports = router;
