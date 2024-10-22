var express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  User = require('../models/user')

// landing page
router.get('/', (req: any, res: any) => {
  res.render('landing')
})

// register form
router.get('/register', (req: any, res: any) => {
  res.render('register', { page: 'register' })
})

// register post
router.post('/register', (req: any, res: any) => {
  const newUser = new User({ username: req.body.username })
  User.register(newUser, req.body.password)
    .then((user: any) => {
      passport.authenticate('local')(req, res, () => {
        req.flash('success', `Welcome to YelpCamp ${user.username}`)
        res.redirect('/campgrounds')
      })
    })
    .catch((err: any) => {
      req.flash('error', err.message)
      res.redirect('/register')
    })
})

// login form
router.get('/login', (req: any, res: any) => {
  res.render('login', { page: 'login' })
})

// login post
router.post(
  '/login',
  passport.authenticate('local', {
    successReturnToOrRedirect: '/campgrounds',
    failureRedirect: '/login',
    successFlash: 'Logged in',
    failureFlash: true,
  })
)

// logout
router.get('/logout', (req: any, res: any) => {
  req.logout((err: any) => {
    if (err) {
      req.flash('error', err.message)
      return res.redirect('back')
    }
    req.flash('success', 'Logged out')
    res.redirect('/campgrounds')
  })
})

module.exports = router
