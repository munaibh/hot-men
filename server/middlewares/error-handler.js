/**
 * Error handler. Send stacktrace only during development.
 * @public
 */

exports.handler = (err, _req, res, _next) => {
  const { status = 500, stack = '', message } = err
  const highlighted = stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
  const details = { message, status, stack: { raw: stack, highlighted } }

  if (!__DEV__) {
    delete details.stack
  }

  res.status(status)
  res.format({
    'text/html': () => res.render('error', details),
    'application/json': () => res.json(details),
  })
}

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (_req, _res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
}
