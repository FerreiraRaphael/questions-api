/**
 * @module lib/middlawares
 * @file Exports custom express middlawares.
 */

const passport = require('passport');
const { withApiError, combileMiddlawares } = require('./helpers');
const httpStatus = require('http-status');

/**
 * Verify if user is authenticated.
 * @function verifyAuthentication
 * @param  {User} req.user Authenticated user
 * @param  {Error} res.user.error Authentication error
 */
function verifyAuthentication(req, res, next) {
  if (req.user && req.user.error) {
    withApiError({
      description: 'User not authenticated',
      error: req.user.error,
      status: httpStatus.UNAUTHORIZED,
      code: 'lib.middlawares.verifyAuthentication'
    })(res);
  } else {
    next();
  }
}

/**
 * Verify if the userId param is the same as the user
 * authenticated id, if a UserId is present.
 * @function isCurrentUserMiddlaware
 * @param  {User} req.user Authenticated user
 * @param  {String} req.params.UserId User Id Url param
 */
function isCurrentUserMiddlaware(req, res, next) {
  if (!req.params.UserId) {
    next();
  } else if (req.user.id === Number(req.params.UserId)) {
    next();
  } else {
    withApiError({
      description: 'User not authorized',
      error: 'User not authorized',
      status: httpStatus.UNAUTHORIZED,
      code: 'lib.middlawares.isCurrentUserMiddlaware'
    })(res);
  }
}

/**
 * A wrapper for express routing handlers, that aplies Bearer auth middlawares.
 * @function withBearerAuth
 * @param {Function[]} middlawares  All arguments passed to this functions,
 *                                  will be passed to the middlawares Array.
 * @returns {Function[]} A array of express middlawares, with Bearer Auth Middlawares.
 */
function withBearerAuth(...middlewares) {
  return combileMiddlawares(
    passport.authenticate('bearer', { session: false }),
    verifyAuthentication,
    isCurrentUserMiddlaware,
    middlewares
  );
}

module.exports = { withBearerAuth };
