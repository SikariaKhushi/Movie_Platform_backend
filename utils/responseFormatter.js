/**
 * Format success response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Object} data - Response data
 * @param {Object} meta - Metadata like pagination
 * @returns {Object} Formatted response
 */
exports.success = (res, statusCode, message, data, meta = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...meta
  });
};

/**
 * Format error response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Error message
 * @param {Object} errors - Detailed errors
 * @returns {Object} Formatted error response
 */
exports.error = (res, statusCode, message, errors = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

/**
 * Format pagination metadata
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @param {Number} totalItems - Total number of items
 * @param {String} baseUrl - Base URL for creating next/prev URLs
 * @returns {Object} Pagination metadata
 */
exports.getPaginationInfo = (page, limit, totalItems, baseUrl) => {
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = parseInt(page, 10) || 1;
  
  // Create pagination metadata
  const pagination = {
    page: currentPage,
    total_pages: totalPages,
    total_results: totalItems
  };

  // Add next page URL if available
  if (currentPage < totalPages) {
    pagination.next_page = `${baseUrl}?page=${currentPage + 1}`;
  }

  // Add previous page URL if available
  if (currentPage > 1) {
    pagination.prev_page = `${baseUrl}?page=${currentPage - 1}`;
  }

  return pagination;
};