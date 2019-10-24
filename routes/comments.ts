import CampgroundDto from "../dtos/campgroundDto";
var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    UserComment = require("../models/userComment"),
    middleware  = require("../middleware");

// New
router.get("/new", middleware.isLoggedIn, (req: any, res: any) => {
    Campground.findById(req.params.id, (err: any, campground: CampgroundDto) => {
        if(err) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
})

// Create
router.post("/", middleware.isLoggedIn, (req: any, res: any) => {
    Campground.findById(req.params.id, (err: any, campground: any) => {
        if(err) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            UserComment.create(req.body.comment, (err: any, comment: any) => {
                if (err) {
                    req.flash("error", "Couldn't add comment");
                    res.redirect("back");
                } else {
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
            })
        }
    })
})

// Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req: any, res: any) => {
    UserComment.findById(req.params.comment_id, (err: any, foundComment: any) => {
        if (err) {
            req.flash("error", "Comment not found");
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment });
        }
    });
});

// Update
router.put("/:comment_id", middleware.checkCommentOwnership, (req: any, res: any) => {
    UserComment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err: any, updatedComment: any) => {
        if (err) {
            req.flash("error", "Comment not found");
            res.redirect("back");
        } else {
            req.flash("success", "Comment updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, (req: any, res: any) => {
    UserComment.findByIdAndRemove(req.params.comment_id, (err: any) => {
        if (err) {
            req.flash("error", "Comment not found");
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;