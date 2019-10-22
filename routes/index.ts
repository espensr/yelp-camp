var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

// middleware
const isLoggedIn = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// landing page
router.get("/", (req: any, res: any) => {
    res.render("landing");
});

// register form
router.get("/register", (req: any, res: any) => {
    res.render("register");
});

// register post
router.post("/register", (req: any, res: any) => {
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
router.get("/login", (req: any, res: any) => {
    res.render("login");
});

// login post
router.post("/login", passport.authenticate("local", 
    {
       successRedirect: "/campgrounds",
       failureRedirect: "/login" 
    }), (req: any, res: any) => {
});

// logout
router.get("/logout", (req: any, res: any) => {
    req.logout();
    res.redirect("/campgrounds");
});

module.exports = router;