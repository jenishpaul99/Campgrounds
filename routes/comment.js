express = require("express");
router = express.Router();
Campground = require("../models/campground.js");
Comments = require("../models/comments.js");
middleware = require("../middleware");

router.get("/campground/:id/comments/new", middleware.isLoggedIn, function (
    req,
    res
) {
    Campground.findById(req.params.id, function (err, retObj) {
        if (err) {
            console.log(err);
        } else {
            res.render("../views/comments/new.ejs", {
                camp: retObj,
            });
        }
    });
});

router.get(
    "/campground/:campid/comments/:commentid/edit",
    middleware.checkCommentOwner,
    function (req, res) {
        Comments.findById(req.params.commentid, function (err, comment) {
            if (err) {
                console.log(err);
            } else {
                res.render("../views/comments/edit.ejs", {
                    comment: comment,
                    campid: req.params.campid,
                });
            }
        });
    }
);

router.put(
    "/campground/:campid/comments/:commentid",
    middleware.checkCommentOwner,
    function (req, res) {
        Comments.findByIdAndUpdate(
            req.params.commentid,
            { text: req.body.comment },
            function (err, comment) {
                if (err) {
                    res.redirect("back");
                } else {
                    req.flash("success", "Comment Updated");
                    res.redirect("/campground/" + req.params.campid);
                }
            }
        );
    }
);

router.delete(
    "/campground/:campid/comments/:commentid",
    middleware.checkCommentOwner,
    function (req, res) {
        Comments.findByIdAndRemove(req.params.commentid, function (err, camp) {
            if (err) {
                console.log(err);
            } else {
                req.flash("success", "Comment Removed");
                res.redirect("/campground/" + req.params.campid);
            }
        });
    }
);

router.post("/campground/:id/comments", middleware.isLoggedIn, function (
    req,
    res
) {
    Campground.findById(req.params.id, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            Comments.create(req.body.comments, function (err, post) {
                if (err) {
                    console.log(err);
                } else {
                    post.author.id = req.user._id;
                    post.author.username = req.user.username;
                    post.save();
                    user.comments.push(post);
                    console.log(post);
                    user.save(function (err, userWithPost) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.flash("success", "Comment Added");
                            res.redirect("/campground/" + req.params.id);
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
