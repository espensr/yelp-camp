"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express"), router = express.Router({ mergeParams: true }), Campground = require("../models/campground"), UserComment = require("../models/userComment"), middleware = require("../middleware"), connect = require("connect-ensure-login");
// New
router.get("/new", connect.ensureLoggedIn("/login"), (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        }
        else {
            res.render("comments/new", { campground: campground });
        }
    });
});
// Create
router.post("/", connect.ensureLoggedIn("/login"), (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        }
        else {
            UserComment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error", "Couldn't add comment");
                    res.redirect("back");
                }
                else {
                    // add username and id
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // save campground
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment added");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});
// Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    UserComment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            req.flash("error", "Comment not found");
            res.redirect("back");
        }
        else {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }
    });
});
// Update
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    UserComment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            req.flash("error", "Comment not found");
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
// Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    UserComment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            req.flash("error", "Comment not found");
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
module.exports = router;
