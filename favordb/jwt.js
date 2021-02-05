const jwt = require('jsonwebtoken');

const createToken = (payload) => {
  return jwt.sign(payload, 'qwerty', {
    expiresIn: '24h',
  });
};
const checkToken = (req, res, next) => {
  if (req.method !== 'OPTIONS') {
    jwt.verify(req.body.token, 'qwerty', (err, decoded) => {
      if (err)
        return res.status(401).send({
          status: 'Unauthorized',
          message: 'token expired or your account had been deactived or closed',
        });
      req.user = decoded;
      next();
    });
  }
};

module.exports = {
  createToken,
  checkToken,
};
