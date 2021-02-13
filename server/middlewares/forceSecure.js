/**
 * Redirect to https:// in production
 * @private
 */

const forceSecure = (req, res, next) => {
  if(__DEV__) return next()
  const isInsecure = !req.secure && req.get('x-forwarded-proto') !== 'https'
  return isInsecure
    ? res.redirect('https://' + req.get('host') + req.originalUrl)
    : next()
}

export default forceSecure