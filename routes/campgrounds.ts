import CampgroundDto from '../dtos/campgroundDto'
var express = require('express'),
  router = express.Router(),
  Campground = require('../models/campground'),
  UserComment = require('../models/userComment'),
  middleware = require('../middleware'),
  NodeGeocoder = require('node-geocoder'),
  connect = require('connect-ensure-login')

// google maps geocoder
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
}

var geocoder = NodeGeocoder(options)

// Index
router.get('/', (req: any, res: any) => {
  //   Campground.find({})
  //   Campground.find({}).then((err: any, allCampgrounds: CampgroundDto[]) => {
  //     if (err) {
  //       req.flash('error', 'Campgrounds not found')
  //       res.redirect('back')
  //     } else {
  //       res.render('campgrounds/index', {
  //         campgrounds: allCampgrounds,
  //         currentUser: req.user,
  //         page: 'campgrounds',
  //       })
  //     }
  //   })
  res.render('campgrounds/index', {
    campgrounds: [
      {
        name: 'Tall Trees Forest',
        image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
        description: 'Calm and quiet between the trees.',
        price: '8',
      },
      {
        name: "Mountain Goat's Rest",
        image:
          'https://cdn.pixabay.com/photo/2018/12/24/22/19/camping-3893587__480.jpg',
        description: 'The perfect place for mountaineers.',
        price: '10',
      },
      {
        name: 'Granite Hill',
        image:
          'https://cdn.pixabay.com/photo/2015/11/07/11/39/camping-1031360__480.jpg',
        description:
          'An open clearing surrounded by trees and rugged mountains.',
        price: '5',
      },
      {
        name: 'Aurora Night',
        image:
          'https://cdn.pixabay.com/photo/2016/02/09/16/35/night-1189929__480.jpg',
        description: 'Auroras almost every night!',
        price: '15',
      },
      {
        name: 'Salmon Creek',
        image:
          'https://cdn.pixabay.com/photo/2015/07/10/17/24/night-839807__480.jpg',
        description: 'A quite fishing paradise.',
        price: '12',
      },
      {
        name: 'Desert Mesa',
        image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
        description:
          'Warm during the day, cool during the night and beautiful sunsets in between.',
        price: '5',
      },
      {
        name: 'Sky View',
        image:
          'https://cdn.pixabay.com/photo/2017/06/17/03/17/gongga-snow-mountain-2411069__480.jpg',
        description: 'For the admirers of aerial views.',
        price: '10',
      },
    ],
    currentUser: req.user,
    page: 'campgrounds',
  })
  //   Campground.find({}, (err: any, allCampgrounds: CampgroundDto[]) => {
  //     if (err) {
  //       req.flash('error', 'Campgrounds not found')
  //       res.redirect('back')
  //     } else {
  //       res.render('campgrounds/index', {
  //         campgrounds: allCampgrounds,
  //         currentUser: req.user,
  //         page: 'campgrounds',
  //       })
  //     }
  //   })
})

// New
router.get('/new', (req: any, res: any) => {
  // router.get('/new', connect.ensureLoggedIn('/login'), (req: any, res: any) => {
  res.render('campgrounds/new')
})

// Create
router.post('/', connect.ensureLoggedIn('/login'), (req: any, res: any) => {
  // get data from form and add to campgrounds array
  const name: string = req.body.name
  const price: string = req.body.price
  const image: string = req.body.image
  const description: string = req.body.description
  const author = {
    id: req.user._id,
    username: req.user.username,
  }
  geocoder.geocode(req.body.location, (err: any, data: any) => {
    if (err || !data.length) {
      console.log('err', err)
      req.flash('error', 'Invalid address')
      return res.redirect('back')
    }
    const lat = data[0].latitude
    const lng = data[0].longitude
    const location = data[0].formattedAddress
    const newCampground = {
      name,
      price,
      image,
      description,
      author,
      location,
      lat,
      lng,
    }
    // Create a new campground and save to DB
    Campground.create(
      newCampground,
      (err: any, newlyCreated: CampgroundDto) => {
        if (err) {
          req.flash('error', "Couldn't add campground")
          res.redirect('back')
        } else {
          //redirect back to campgrounds page
          req.flash('success', 'Campground added')
          res.redirect('/campgrounds')
        }
      }
    )
  })
})

// Show
router.get('/:id', (req: any, res: any) => {
  res.render('campgrounds/show', {
    campground: {
      name: 'Desert Mesa',
      image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
      description:
        'Warm during the day, cool during the night and beautiful sunsets in between.',
      price: '5',
      comments: [
        {
          text: 'Showcase comment',
          author: {
            id: '123',
            username: 'Yelpcamp',
          },
        },
        {
          text: 'Showcase comment 2',
          author: {
            id: '123',
            username: 'Yelpcamp',
          },
        },
      ],
      author: {
        id: '123',
        username: 'Yelpcamp',
      },
    },
  })
  //   Campground.findById(req.params.id)
  //     .populate('comments')
  //     .exec((err: any, foundCampground: CampgroundDto) => {
  //       if (err) {
  //         req.flash('error', 'Campground not found')
  //         res.redirect('back')
  //       } else {
  //         res.render('campgrounds/show', { campground: foundCampground })
  //       }
  //     })
})

// Edit
router.get(
  '/:id/edit',
  middleware.checkCampgroundOwnership,
  (req: any, res: any) => {
    Campground.findById(req.params.id, (err: any, foundCampground: any) => {
      if (err) {
        req.flash('error', 'Campground not found')
        res.redirect('back')
      } else {
        res.render('campgrounds/edit', { campground: foundCampground })
      }
    })
  }
)

// Update
router.put(
  '/:id',
  middleware.checkCampgroundOwnership,
  middleware.geocodeData,
  (req: any, res: any) => {
    Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground,
      function (err: any, updatedCampground: any) {
        if (err) {
          req.flash('error', 'Campground not found')
          res.redirect('back')
        } else {
          console.log('updated data')
          req.flash('success', 'Campground updated')
          res.redirect('/campgrounds/' + req.params.id)
        }
      }
    )
  }
)

// destroy
router.delete(
  '/:id',
  middleware.checkCampgroundOwnership,
  (req: any, res: any) => {
    Campground.findByIdAndRemove(
      req.params.id,
      (err: any, camggroundRemoved: any) => {
        if (err) {
          req.flash('error', "Couldn't delete campground")
          res.redirect('back')
        } else {
          UserComment.deleteMany(
            { _id: { $in: camggroundRemoved.comments } },
            (err: any) => {
              if (err) {
                req.flash('error', "Couldn't delete associated comments")
                res.redirect('back')
              } else {
                req.flash('success', 'Campground deleted')
                res.redirect('/campgrounds')
              }
            }
          )
        }
      }
    )
  }
)

module.exports = router
