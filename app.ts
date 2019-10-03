import express from "express";
import bodyParser from "body-parser";
const mongoose = require("mongoose");
const app = express();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set('views', './views');

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

interface Campground {
    name: string;
    image: string;
    description: string;
}

// Campground.create(
//     {
//         name: "Granite Hill", 
//         image: "https://cdn.pixabay.com/photo/2015/11/07/11/39/camping-1031360__480.jpg",
//         description: "This is a huge granite hill. No bathrooms. No water. beautiful granite!"
//     }, (err: any, campground: any) => {
//         if(err){
//             console.log(err);
//         } else {
//             console.log("Newly Creeated Campground");
//             console.log(campground);
//         }
//     });

app.get("/", (req, res) => {
    res.render("landing");
});

// const campgrounds: campground[] = [
//     {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2015/07/10/17/24/night-839807__480.jpg"},
//     {name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2015/11/07/11/39/camping-1031360__480.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://cdn.pixabay.com/photo/2018/12/24/22/19/camping-3893587__480.jpg"}
// ]

app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err: any, allCampgrounds: Campground[]) => {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

app.post("/campgrounds", (req, res) => {
    const name: string = req.body.name;
    const image: string = req.body.image;
    const description: string = req.body.description;
    const newCampground: Campground = {name, image, description};

    Campground.create(newCampground, (err: any, newlyCreated: Campground) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id, (err: any, foundCampground: Campground) => {
        if(err) {
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(3001, function() { 
    console.log('Server listening on port 3001'); 
});