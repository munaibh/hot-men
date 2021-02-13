/**
 * Error handler. Send stacktrace only during development.
 * @public
 */

const notFoundHandler = (_req, _res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
}

const errorHandler = (err, _req, res, _next) => {
  const { status = 500, stack = '', message } = err
  const highlighted = stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
  const error = { message, status, stack: { raw: stack, highlighted } }

  if (!__DEV__) delete error.stack

  res.status(status)
  res.format({
    'text/html': () => res.render('error', error),
    'application/json': () => res.json(error),
  })
}

export {
  notFoundHandler,
  errorHandler,
}