import CampgroundDto from "../dtos/campgroundDto";
var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground"),
    UserComment = require("../models/userComment"),
    middleware  = require("../middleware");

// Index
router.get("/", (req: any, res: any) => {
    Campground.find({}, (err: any, allCampgrounds: CampgroundDto[]) => {
        if(err) {
            req.flash("error", "Campgrounds not found");
            res.redirect("back");
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

// New
router.get("/new", middleware.isLoggedIn, (req: any, res: any) => {
    res.render("campgrounds/new");
});

// Create
router.post("/", middleware.isLoggedIn, (req: any, res: any) => {
    const name: string = req.body.name;
    const price: string = req.body.price;
    const image: string = req.body.image;
    const description: string = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    console.log("id", typeof author.id);
    console.log("username", typeof author.username);
    const newCampground: CampgroundDto = {name, price, image, description, author};

    Campground.create(newCampground, (err: any, newlyCreated: CampgroundDto) => {
        if(err) {
            req.flash("error", "Couldn't add campground");
            res.redirect("back");
        } else {
            req.flash("success", "Campground added");
            res.redirect("/campgrounds");
        }
    });
});

// Show
router.get("/:id", (req: any, res: any) => {
    Campground.findById(req.params.id).populate("comments").exec((err: any, foundCampground: CampgroundDto) => {
        if(err) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// Edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req: any, res: any) => {
    Campground.findById(req.params.id, (err: any, foundCampground: any) => {
        if(err) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// Update
router.put("/:id", middleware.checkCampgroundOwnership, (req: any, res: any) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err: any, updatedCampground: any) => {
        if (err) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            req.flash("success", "Campground updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// destroy
router.delete("/:id", middleware.checkCampgroundOwnership, (req: any, res: any) => {
    Campground.findByIdAndRemove(req.params.id, (err: any, camggroundRemoved: any) => {
        if (err) {
            req.flash("error", "Couldn't delete campground");
            res.redirect("back");
        } else {
            UserComment.deleteMany( {_id: { $in: camggroundRemoved.comments } }, (err: any) => {
                if (err) {
                    req.flash("error", "Couldn't delete associated comments");
                    res.redirect("back");      
                } else {
                    req.flash("success", "Campground deleted");
                    res.redirect("/campgrounds");
                }
            });
        }
    });
});

module.exports = router;