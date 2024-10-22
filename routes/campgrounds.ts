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
  Campground.find({})
    .then((allCampgrounds: any) => {
      res.render('campgrounds/index', {
        campgrounds: allCampgrounds,
        currentUser: req.user,
        page: 'campgrounds',
      })
    })
    .catch((err: any) => {
      req.flash('error', 'Campgrounds not found')
      res.redirect('back')
    })
})

// New
router.get('/new', connect.ensureLoggedIn('/login'), (req: any, res: any) => {
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
    Campground.create(newCampground)
      .then(() => {
        //redirect back to campgrounds page
        req.flash('success', 'Campground added')
        res.redirect('/campgrounds')
      })
      .catch((err: any) => {
        req.flash('error', "Couldn't add campground")
        res.redirect('back')
      })
  })
})

// Show
router.get('/:id', (req: any, res: any) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .then((foundCampground: CampgroundDto) => {
      res.render('campgrounds/show', { campground: foundCampground })
    })
    .catch((err: any) => {
      req.flash('error', 'Campground not found')
      res.redirect('back')
    })
})

// Edit
router.get(
  '/:id/edit',
  middleware.checkCampgroundOwnership,
  (req: any, res: any) => {
    Campground.findById(req.params.id)
      .then((foundCampground: any) => {
        res.render('campgrounds/edit', { campground: foundCampground })
      })
      .catch((err: any) => {
        req.flash('error', 'Campground not found')
        res.redirect('back')
      })
  }
)

// Update
router.put(
  '/:id',
  middleware.checkCampgroundOwnership,
  middleware.geocodeData,
  (req: any, res: any) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground)
      .then(() => {
        console.log('updated data')
        req.flash('success', 'Campground updated')
        res.redirect('/campgrounds/' + req.params.id)
      })
      .catch((err: any) => {
        req.flash('error', 'Campground not found')
        res.redirect('back')
      })
  }
)

// destroy
router.delete(
  '/:id',
  middleware.checkCampgroundOwnership,
  (req: any, res: any) => {
    Campground.findByIdAndDelete(req.params.id)
      .then((camggroundRemoved: any) => {
        UserComment.deleteMany({ _id: { $in: camggroundRemoved.comments } })
          .then(() => {
            req.flash('success', 'Campground deleted')
            res.redirect('/campgrounds')
          })
          .catch((err: any) => {
            req.flash('error', "Couldn't delete associated comments")
            res.redirect('back')
          })
      })
      .catch((err: any) => {
        req.flash('error', "Couldn't delete campground")
        res.redirect('back')
      })
  }
)

module.exports = router
