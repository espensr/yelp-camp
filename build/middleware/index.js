"use strict";
var Campground = require("../models/campground"), UserComment = require("../models/userComment"), NodeGeocoder = require("node-geocoder");
// google maps geocoder
var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};
var geocoder = NodeGeocoder(options);
const middlewareObj = {};
middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            }
            else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};
middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        UserComment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            }
            else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};
middlewareObj.geocodeData = (req, res, next) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        }
        else {
            if (foundCampground.location !== req.body.location) {
                geocoder.geocode(req.body.location, (err, data) => {
                    if (err || !data.length) {
                        req.flash('error', 'Invalid address');
                        return res.redirect('back');
                    }
                    req.body.campground.lat = data[0].latitude;
                    req.body.campground.lng = data[0].longitude;
                    req.body.campground.location = data[0].formattedAddress;
                    console.log('geocoded data');
                    return next();
                });
            }
            else {
                return next();
            }
        }
    });
};
module.exports = middlewareObj;
