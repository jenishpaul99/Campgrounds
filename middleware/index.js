Campground = require("../models/campground.js");
Comments = require("../models/comments.js");

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Log In to continue");
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                req.flash("Campground Not Found");
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("Permission Denied");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please Log In to continue");
        res.redirect("/login");
    }
}

function checkCommentOwner(req, res, next) {
    if (req.isAuthenticated) {
        Comments.findById(req.params.commentid, function (err, comment) {
            if (err) {
                req.flash("Comment Not Found");
                res.redirect("back");
            } else {
                if (comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("Permission Denied");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please Log In to continue");
        res.redirect("/login");
    }
}

middlewareObj = {
    isLoggedIn: isLoggedIn,
    checkCampgroundOwnership: checkCampgroundOwnership,
    checkCommentOwner: checkCommentOwner,
};

module.exports = middlewareObj;
