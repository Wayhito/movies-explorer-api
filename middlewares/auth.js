const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

function GFG(txt) {
  console.log(txt);
}

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  GFG({ authorization });

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'secretkey'}`);
    GFG(payload);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  req.user = payload;

  next();
};
