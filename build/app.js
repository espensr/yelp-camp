"use strict";
require('dotenv').config();
var express = require("express"), app = express(), mongoose = require("mongoose"), bodyParser = require("body-parser"), flash = require("connect-flash"), passport = require("passport"), LocalStrategy = require("passport-local"), methodOverride = require("method-override"), User = require("./models/user"), seedDB = require("./seeds");
// routes import
var commentRoutes = require("./routes/comments"), campgroundRoutes = require("./routes/campgrounds"), indexRoutes = require("./routes/index");
// mongoose config
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DATABASEURL);
// app config
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set('views', './views');
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
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
// locals config
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
// refresh database
// seedDB();
// routes config
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.listen(process.env.PORT, () => {
    console.log('Server is listening');
});
