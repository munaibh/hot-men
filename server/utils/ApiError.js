class ApiError extends Error {
  constructor(status, message, stack = '') {
    super(message)
    this.status = status
    stack ? this.stack = stack : Error.captureStackTrace(this, this.constructor)
  }
}

export default ApiError