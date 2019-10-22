import CampgroundDto from "../dtos/campgroundDto";
var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    UserComment = require("../models/userComment");

// middleware
const isLoggedIn = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
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

module.exports = router;