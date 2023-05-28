const jwt = require('jsonwebtoken');
const { PRIVATE_KEY_JWT } = process.env;

exports.authJWTMiddleware = function authJWTMiddleware (req, res, next) {
  const headerAuth = req.headers.authorization;

  if (headerAuth) {
    const token = headerAuth.split(' ')[1];

    jwt.verify(token, PRIVATE_KEY_JWT, (err, user) => {
      if (err) {
        return res.status(403).json({
          httpCode: 403,
          code: 'UMER0013',
          message: 'Token is invalid'
        });
      }

      req.user = user;
      next();
    })
  } else {
    return res.status(401).json({
      httpCode: 401,
      code: 'UMER0012',
      message: 'Token not found'
    });
  }
};

exports.getJWT = function getJWT (payload) {
  return jwt.sign(payload, PRIVATE_KEY_JWT, { expiresIn: '1h' });
};