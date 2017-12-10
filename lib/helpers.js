/**
 * @module lib/helpers
 * @file Export Helpers functions that can be reused.
 */

const jwt = require('jsonwebtoken');

/**
 * Transform a Error object in JSON
 * @function errorToJSON
 * @param  {Error | string} error A error object or a string
 * @return {{message: string, stack: string} | string} Error transformed to JSON or string
 */
function errorToJSON(error) {
  return error instanceof Error
    ? Object.getOwnPropertyNames(error).reduce(
        (jsonError, errorKey) => ({
          ...jsonError,
          [errorKey]: error[errorKey]
        }),
        {}
      )
    : error;
}

/**
 * @typedef ApiResponseOptions
 * @property {string} description - Response description.
 * @property {any} body - Response Body.
 * @property {boolean} [success=true] - Indicates if operation was a success or not, default value true.
 * @property {number} [status=200] - The Response status code, default value 200.
 *
 * @function withApiResponse
 * Function wrapper for the Express Response Object,
 * it responses a JSON with the Api response Schema
 * {
 *  "message": string,
 *  "data": any,
 *  "success": boolean
 * }
 * @param {ApiResponseOptions} options - Api Response Options.
 * @return {Function} - Returns a function that wrap the response object and send a api response schema in json.
 */
function withApiResponse(options) {
  const { description, body, success = true, status = 200 } = options;
  return res => {
    res.status(status).json({ description, body, success });
  };
}
/**
 * @typedef ApiErrorOptions
 * @property  {string} description Describes the error.
 * @property  {any} error Error object, showed only in development envoriment.
 * @property  {string} [code=untracked] A code for tracking where the code.
 * @property  {number} [status=200] The Response status code.
 *
 * @function withApiError
 * Function wrapper for the Express Response Object,
 * it responses a JSON with the Api Error Schema
 * {
 *  "description": string,
 *  "error": any,
 *  "code": string
 * }
 * @param  {ApiErrorOptions} options Api Error options.
 * @return {Function} - Returns a function that wrap the response object and send a api error schema in json.
 */
function withApiError(options) {
  const { description, error, code = 'untracked', status = 400 } = options;
  return res => {
    res.status(status).json({
      description,
      ...(process.env.NODE_ENV !== 'production'
        ? { error: errorToJSON(error), code }
        : {})
    });
  };
}

/**
 * Combine express middlawares into a Array.
 * @param {*Function[]} combileMiddlawares All arguments passed to this functions,
 * will be passed to the middlawares Array.
 * @returns {Function[]} Array of express middlawares.
 */
function combileMiddlawares(...middlawares) {
  return [
    ...middlawares.reduce(
      (result, next) => [
        ...result,
        ...(Array.isArray(next) ? combileMiddlawares(...next) : [next])
      ],
      []
    )
  ];
}

async function createToken(data) {
  try {
    const token = await jwt.sign(
      data,
      `${process.env.APP_SECRET || 'development'}`
    );
    return token;
  } catch (e) {
    return e;
  }
}

module.exports = {
  withApiError,
  withApiResponse,
  combileMiddlawares,
  createToken
};
