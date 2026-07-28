// @desc    Health check endpoint
// @route   GET /api/health
export const getHealthStatus = async (req, res) => {
  res.status(200).json({
    status: 'ok'
  });
};
