module.exports = function(req, res, next) {
  if (!req.session.isAuthenticated && !req.session.isAdmin) {
    return res.redirect('/auth/login')
  }

  next()
}