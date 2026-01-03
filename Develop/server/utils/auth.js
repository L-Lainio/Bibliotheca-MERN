const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

const getToken = (req = {}) => {
  let token = req.body?.token || req.query?.token || req.headers?.authorization;
  if (req.headers?.authorization) {
    token = token.split(' ').pop().trim();
  }
  return token;
};

const decodeToken = (token) => {
  if (!token) return null;
  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    return data;
  } catch {
    console.log('Invalid token');
    return null;
  }
};

module.exports = {
  // GraphQL context-aware auth helper
  authMiddleware: ({ req }) => {
    const token = getToken(req);
    const user = decodeToken(token);
    return { user };
  },
  // Express middleware fallback to avoid breaking existing REST routes
  authExpressMiddleware: (req, res, next) => {
    const token = getToken(req);
    if (!token) {
      return res.status(400).json({ message: 'You have no token!' });
    }
    const user = decodeToken(token);
    if (!user) {
      return res.status(400).json({ message: 'invalid token!' });
    }
    req.user = user;
    return next();
  },
  signToken: ({ username, email, _id }) => {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
