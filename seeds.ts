import CampgroundDto from "./dtos/campgroundDto";
var Campground  = require("./models/campground"),
    UserComment = require("./models/userComment"),
    User = require("./models/user");

const seeds: CampgroundDto[] = [
    { 
        name: "Tall Trees Forest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Calm and quiet between the trees.",
        price: "8"
    },
    {
        name: "Mountain Goat's Rest", 
        image: "https://cdn.pixabay.com/photo/2018/12/24/22/19/camping-3893587__480.jpg",
        description: "The perfect place for mountaineers.",
        price: "10"
    },
    {
        name: "Granite Hill", 
        image: "https://cdn.pixabay.com/photo/2015/11/07/11/39/camping-1031360__480.jpg",
        description: "An open clearing surrounded by trees and rugged mountains.",
        price: "5"
    },
    {
        name: "Aurora Night", 
        image: "https://cdn.pixabay.com/photo/2016/02/09/16/35/night-1189929__480.jpg",
        description: "Auroras almost every night!",
        price: "15"
    },
    {
        name: "Salmon Creek", 
        image: "https://cdn.pixabay.com/photo/2015/07/10/17/24/night-839807__480.jpg",
        description: "A quite fishing paradise.",
        price: "12"
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Warm during the day, cool during the night and beautiful sunsets in between.",
        price: "5"
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "An open clearing at the bottom of a canyon.",
        price: "5"
    },
    {
        name: "Sky View", 
        image: "https://cdn.pixabay.com/photo/2017/06/17/03/17/gongga-snow-mountain-2411069__480.jpg",
        description: "For the admirers of aerial views.",
        price: "10"
    },
]
 
const seedDB = async () => {
    try {
        await Campground.deleteMany({});
        console.log("Campgrounds removed");
        await UserComment.deleteMany({});
        console.log("Comments removed");
        await User.deleteMany({});
        console.log("Users removed");

        const seedUser = await User.create({
            username: "Yelpcamp"
        });

        let newUser = new User({username: "test"});
        newUser = await User.register(newUser, "123");
        console.log("Users created");

        for (const seed of seeds) {
            let campground = await Campground.create(seed);
            console.log("Campground created");
            let comment = await UserComment.create({
                    text: "Showcase comment",
                    author: {
                        id: seedUser._id,
                        username: seedUser.username
                    }
            });
            campground.comments.push(comment);
            console.log("Comment created");
            const author = {
                id: seedUser._id,
                username: seedUser.username
            }
            campground.author = author;
            console.log("Author added");
            campground.save();
            console.log("Campground updated");
        }
    } catch (err) {
        console.log(err);
    }
}
 
module.exports = seedDB;
