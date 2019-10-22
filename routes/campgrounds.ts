import CampgroundDto from "../dtos/campgroundDto";
var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground");

// middleware
const isLoggedIn = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// Index
router.get("/", (req: any, res: any) => {
    Campground.find({}, (err: any, allCampgrounds: CampgroundDto[]) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

// New
router.get("/new", isLoggedIn, (req: any, res: any) => {
    res.render("campgrounds/new");
});

// Create
router.post("/", isLoggedIn, (req: any, res: any) => {
    const name: string = req.body.name;
    const image: string = req.body.image;
    const description: string = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCampground: CampgroundDto = {name, image, description, author};

    Campground.create(newCampground, (err: any, newlyCreated: CampgroundDto) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// Show
router.get("/:id", (req: any, res: any) => {
    Campground.findById(req.params.id).populate("comments").exec((err: any, foundCampground: CampgroundDto) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

module.exports = router;