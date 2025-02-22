// Helper function to handle errors
const handleError = (res, message, status = 400) => {
  res.status(status).send(message);
};

module.exports = { handleError };
