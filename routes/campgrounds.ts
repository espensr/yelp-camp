import CampgroundDto from "../dtos/campgroundDto";
var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground"),
    UserComment = require("../models/userComment"),
    middleware  = require("../middleware"),
    NodeGeocoder = require("node-geocoder"),
    connect = require("connect-ensure-login");

// google maps geocoder
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// Index
router.get("/", (req: any, res: any) => {
    Campground.find({}, (err: any, allCampgrounds: CampgroundDto[]) => {
        if(err) {
            req.flash("error", "Campgrounds not found");
            res.redirect("back");
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user, page: 'campgrounds'});
        }
    });
});

// New
router.get("/new", connect.ensureLoggedIn("/login"), (req: any, res: any) => {
    res.render("campgrounds/new");
});

// Create
router.post("/", connect.ensureLoggedIn("/login"), (req: any, res: any) => {
    // get data from form and add to campgrounds array
    const name: string = req.body.name;
    const price: string = req.body.price;
    const image: string = req.body.image;
    const description: string = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, (err: any, data: any) => {
      if (err || !data.length) {
        console.log('err', err);
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      const lat = data[0].latitude;
      const lng = data[0].longitude;
      const location = data[0].formattedAddress;
      const newCampground = {name, price, image, description, author, location, lat, lng};
      // Create a new campground and save to DB
      Campground.create(newCampground, (err: any, newlyCreated: CampgroundDto) => {
          if(err){
            req.flash("error", "Couldn't add campground");
            res.redirect("back");
          } else {
              //redirect back to campgrounds page
              req.flash("success", "Campground added");
              res.redirect("/campgrounds");
          }
      });
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
router.put("/:id", middleware.checkCampgroundOwnership, middleware.geocodeData, (req: any, res: any) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err: any, updatedCampground: any){
        if(err){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            console.log('updated data');
            req.flash("success","Campground updated");
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