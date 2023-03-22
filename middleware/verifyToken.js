const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
  const token = request.header('auth-token');

  if (!token)
    return response.status(401).json({ message: 'Yêu cầu bị từ chối!' });

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return response.status(401).json({ message: 'Yêu cầu bị từ chối!' });
      } else {
        request.userID = decoded._id;
        request.isLoggedIn = true;
        next();
      }
    });
  } catch (err) {
    return response.status(400).json({ message: 'Không xác định được token' });
  }
};
