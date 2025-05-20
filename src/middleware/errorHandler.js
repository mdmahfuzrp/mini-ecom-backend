/**
 * Global error handler middleware
 * This ensures all errors returned by the API have a consistent format
 */
const errorHandler = (err, req, res, next) => {
    // Default to 500 server error
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        statusCode: statusCode,
        message: err.message || 'An unexpected error occurred',
        error: getErrorType(statusCode),
        // Include stack trace in development environment
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

// Helper function to get error type based on status code
const getErrorType = statusCode => {
    switch (statusCode) {
        case 400:
            return 'Bad Request';
        case 401:
            return 'Unauthorized';
        case 403:
            return 'Forbidden';
        case 404:
            return 'Not Found';
        case 409:
            return 'Conflict';
        case 422:
            return 'Unprocessable Entity';
        default:
            return 'Internal Server Error';
    }
};

module.exports = errorHandler;
