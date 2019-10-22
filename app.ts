import express from "express";
import bodyParser from "body-parser";
import CampgroundDto from "./dtos/campgroundDto";
const app           = express(),
      passport      = require("passport"),
      LocalStrategy = require("passport-local"),
      UserComment   = require("./models/userComment"),
      Campground    = require("./models/campground"),
      User          = require("./models/user"),
      seedDB        = require("./seeds");
var mongoose        = require("mongoose");

// mongoose config
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp");

// app config
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set('views', './views');
app.use(express.static(__dirname + "/public"));

// passport config
app.use(require("express-session")({
    secret: "Illuminati",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req: any, res: any, next: any) => {
    res.locals.currentUser = req.user;
    next();
});

seedDB(); // refresh database

// middleware
const isLoggedIn = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// landing page
app.get("/", (req: any, res: any) => {
    res.render("landing");
});

// campgrounds INDEX
app.get("/campgrounds", (req: any, res: any) => {
    Campground.find({}, (err: any, allCampgrounds: CampgroundDto[]) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

// campgrounds NEW
app.get("/campgrounds/new", (req: any, res: any) => {
    res.render("campgrounds/new");
});

// campgrounds CREATE
app.post("/campgrounds", (req: any, res: any) => {
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
app.get("/campgrounds/:id", (req: any, res: any) => {
    Campground.findById(req.params.id).populate("comments").exec((err: any, foundCampground: CampgroundDto) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// comments NEW
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req: any, res: any) => {
    Campground.findById(req.params.id, (err: any, campground: CampgroundDto) => {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
})

// comments CREATE
app.post("/campgrounds/:id/comments", isLoggedIn, (req: any, res: any) => {
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

// register form
app.get("/register", (req: any, res: any) => {
    res.render("register");
});

// register post
app.post("/register", (req: any, res: any) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err: any, user: any) => {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds");
        })
    })
});

// login form
app.get("/login", (req: any, res: any) => {
    res.render("login");
});

// login post
app.post("/login", passport.authenticate("local", 
    {
       successRedirect: "/campgrounds",
       failureRedirect: "/login" 
    }), (req: any, res: any) => {
});

// logout
app.get("/logout", (req: any, res: any) => {
    req.logout();
    res.redirect("/campgrounds");
});

app.listen(3001, () => { 
    console.log('Server listening on port 3001'); 
});