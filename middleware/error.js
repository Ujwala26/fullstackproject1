const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === 'CastError') {
    return res.status(404).json({ message: 'Resource not found' });
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate field value entered' });
  }

  res.status(err.statusCode || 500).json({
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
