/**
 * Send a standardized success response.
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {any} data - Payload data
 * @param {number} statusCode - HTTP status code
 */
export const successResponse = (res, message, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send a standardized error response.
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {any} errors - Error details
 * @param {number} statusCode - HTTP status code
 */
export const errorResponse = (res, message, errors, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};
