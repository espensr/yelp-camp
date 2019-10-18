import express from "express";
import bodyParser from "body-parser";
import CampgroundDto from "./dtos/campgroundDto";
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const UserComment = require("./models/userComment");
const seedDB = require("./seeds");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set('views', './views');
app.use(express.static(__dirname + "/public"));

seedDB();

// landing page
app.get("/", (req, res) => {
    res.render("landing");
});

// campgrounds INDEX
app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err: any, allCampgrounds: CampgroundDto[]) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// campgrounds NEW
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

// campgrounds CREATE
app.post("/campgrounds", (req, res) => {
    const name: string = req.body.name;
    const image: string = req.body.image;
    const description: string = req.body.description;
    const newCampground: CampgroundDto = {name, image, description};

    Campground.create(newCampground, (err: any, newlyCreated: CampgroundDto) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// campgrounds SHOW
app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err: any, foundCampground: CampgroundDto) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// comments NEW
app.get("/campgrounds/:id/comments/new", (req, res) => {
    Campground.findById(req.params.id, (err: any, campground: CampgroundDto) => {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
})

// comments CREATE
app.post("/campgrounds/:id/comments", (req, res) => {
    Campground.findById(req.params.id, (err: any, campground: any) => {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            UserComment.create(req.body.comment, (err: any, comment: any) => {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

app.listen(3001, function() { 
    console.log('Server listening on port 3001'); 
});