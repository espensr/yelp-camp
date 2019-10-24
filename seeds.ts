import CampgroundDto from "./dtos/campgroundDto";
var Campground  = require("./models/campground"),
    UserComment = require("./models/userComment");
 
const data: CampgroundDto[] = [
    { 
        name: "Tall Trees Forest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Calm and quiet between the trees."
    },
    {
        name: "Mountain Goat's Rest", 
        image: "https://cdn.pixabay.com/photo/2018/12/24/22/19/camping-3893587__480.jpg",
        description: "The perfect place for mountaineers."
    },
    {
        name: "Granite Hill", 
        image: "https://cdn.pixabay.com/photo/2015/11/07/11/39/camping-1031360__480.jpg",
        description: "An open clearing surrounded by trees and rugged mountains."
    },
    {
        name: "Aurora Night", 
        image: "https://cdn.pixabay.com/photo/2016/02/09/16/35/night-1189929__480.jpg",
        description: "Auroras almost every night!"
    },
    {
        name: "Salmon Creek", 
        image: "https://cdn.pixabay.com/photo/2015/07/10/17/24/night-839807__480.jpg",
        description: "A quite fishing paradise."
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Warm during the day, cool during the night and beautiful sunsets in between."
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "An open clearing at the bottom of a canyon."
    },
    {
        name: "Sky View", 
        image: "https://cdn.pixabay.com/photo/2017/06/17/03/17/gongga-snow-mountain-2411069__480.jpg",
        description: "For the admirers of aerial views."
    },
]
 
const seedDB = () => {
   //Remove all campgrounds
   Campground.deleteMany({}, (err: any) => {
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        UserComment.deleteMany({}, (err: any) => {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
            //  //add a few campgrounds
            // data.forEach((seed: CampgroundDto) => {
            //     Campground.create(seed, (err: any, campground: any) => {
            //         if(err){
            //             console.log(err)
            //         } else {
            //             console.log("added a campground");
            //             // // create a comment
            //             // UserComment.create(
            //             //     {
            //             //         text: "This place is great, but I wish there was internet",
            //             //         author: "Homer"
            //             //     }, (err: any, comment: any) => {
            //             //         if(err){
            //             //             console.log(err);
            //             //         } else {
            //             //             campground.comments.push(comment);
            //             //             campground.save();
            //             //             console.log("Created new comment");
            //             //         }
            //             //     }
            //             // );
            //         }
            //     });
            // });
        });
    }); 
}
 
module.exports = seedDB;
