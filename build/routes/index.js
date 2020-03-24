"use strict";
var express = require("express"), router = express.Router(), passport = require("passport"), User = require("../models/user");
// landing page
router.get("/", (req, res) => {
    res.render("landing");
});
// register form
router.get("/register", (req, res) => {
    res.render("register", { page: 'register' });
});
// register post
router.post("/register", (req, res) => {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", `Welcome to YelpCamp ${user.username}`);
            res.redirect("/campgrounds");
        });
    });
});
// login form
router.get("/login", (req, res) => {
    res.render("login", { page: 'login' });
});
// login post
router.post("/login", passport.authenticate("local", {
    successReturnToOrRedirect: "/campgrounds",
    failureRedirect: "/login",
    successFlash: "Logged in",
    failureFlash: true
}), (req, res) => {
});
// logout
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged out");
    res.redirect("/campgrounds");
});
module.exports = router;
