import CampgroundDto from "../dtos/campgroundDto";
var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    UserComment = require("../models/userComment");

// middlewares
const isLoggedIn = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

const checkCommentOwnership = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
        UserComment.findById(req.params.comment_id, (err: any, foundComment: any) => {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

// New
router.get("/new", isLoggedIn, (req: any, res: any) => {
    Campground.findById(req.params.id, (err: any, campground: CampgroundDto) => {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
})

// Create
router.post("/", isLoggedIn, (req: any, res: any) => {
    Campground.findById(req.params.id, (err: any, campground: any) => {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            UserComment.create(req.body.comment, (err: any, comment: any) => {
                if (err) {
                    console.log(err);
                } else {
                    // add username and id
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // save campground
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

// Edit
router.get("/:comment_id/edit", checkCommentOwnership, (req: any, res: any) => {
    UserComment.findById(req.params.comment_id, (err: any, foundComment: any) => {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment });
        }
    });
});

// Update
router.put("/:comment_id", checkCommentOwnership, (req: any, res: any) => {
    UserComment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err: any, updatedComment: any) => {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy
router.delete("/:comment_id", checkCommentOwnership, (req: any, res: any) => {
    UserComment.findByIdAndRemove(req.params.comment_id, (err: any) => {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;