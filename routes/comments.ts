import CampgroundDto from '../dtos/campgroundDto'
var express = require('express'),
  router = express.Router({ mergeParams: true }),
  Campground = require('../models/campground'),
  UserComment = require('../models/userComment'),
  middleware = require('../middleware'),
  connect = require('connect-ensure-login')

// New
router.get('/new', connect.ensureLoggedIn('/login'), (req: any, res: any) => {
  Campground.findById(req.params.id)
    .then((campground: CampgroundDto) => {
      res.render('comments/new', { campground: campground })
    })
    .catch((err: any) => {
      req.flash('error', 'Campground not found')
      res.redirect('back')
    })
})

// Create
router.post('/', connect.ensureLoggedIn('/login'), (req: any, res: any) => {
  Campground.findById(req.params.id)
    .then((campground: any) => {
      UserComment.create(req.body.comment)
        .then((comment: any) => {
          // add username and id
          comment.author.id = req.user._id
          comment.author.username = req.user.username
          // save comment
          comment.save()
          // save campground
          campground.comments.push(comment)
          campground.save()
          req.flash('success', 'Comment added')
          res.redirect('/campgrounds/' + campground._id)
        })
        .catch((err: any) => {
          req.flash('error', "Couldn't add comment")
          res.redirect('back')
        })
    })
    .catch((err: any) => {
      req.flash('error', 'Campground not found')
      res.redirect('back')
    })
})

// Edit
router.get(
  '/:comment_id/edit',
  middleware.checkCommentOwnership,
  (req: any, res: any) => {
    UserComment.findById(req.params.comment_id)
      .then((foundComment: any) => {
        res.render('comments/edit', {
          campground_id: req.params.id,
          comment: foundComment,
        })
      })
      .catch((err: any) => {
        req.flash('error', 'Comment not found')
        res.redirect('back')
      })
  }
)

// Update
router.put(
  '/:comment_id',
  middleware.checkCommentOwnership,
  (req: any, res: any) => {
    UserComment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
      .then(() => {
        req.flash('success', 'Comment updated')
        res.redirect('/campgrounds/' + req.params.id)
      })
      .catch((err: any) => {
        req.flash('error', 'Comment not found')
        res.redirect('back')
      })
  }
)

// Destroy
router.delete(
  '/:comment_id',
  middleware.checkCommentOwnership,
  (req: any, res: any) => {
    UserComment.findByIdAndDelete(req.params.comment_id)
      .then(() => {
        req.flash('success', 'Comment deleted')
        res.redirect('/campgrounds/' + req.params.id)
      })
      .catch((err: any) => {
        req.flash('error', 'Comment not found')
        res.redirect('back')
      })
  }
)

module.exports = router
