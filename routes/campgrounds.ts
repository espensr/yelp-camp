import CampgroundDto from "../dtos/campgroundDto";
var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
    UserComment = require("../models/userComment");

// middlewares
const isLoggedIn = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

const checkCampgroundOwnership = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err: any, foundCampground: any) => {
            if (err) {
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
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

// Edit
router.get("/:id/edit", checkCampgroundOwnership, (req: any, res: any) => {
    Campground.findById(req.params.id, (err: any, foundCampground: any) => {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// Update
router.put("/:id", checkCampgroundOwnership, (req: any, res: any) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err: any, updatedCampground: any) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// destroy
router.delete("/:id", checkCampgroundOwnership, (req: any, res: any) => {
    Campground.findByIdAndRemove(req.params.id, (err: any, camggroundRemoved: any) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            UserComment.deleteMany( {_id: { $in: camggroundRemoved.comments } }, (err: any) => {
                if (err) {
                    res.redirect("/campgrounds");        
                } else {
                    res.redirect("/campgrounds");
                }
            });
        }
    });
});

module.exports = router;