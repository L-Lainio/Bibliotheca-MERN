const router = require('express').Router();
const {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} = require('../../controllers/user-controller');

// import middleware
const { authExpressMiddleware } = require('../../utils/auth');

// put authMiddleware anywhere we need to send a token for verification of user
router.route('/').post(createUser).put(authExpressMiddleware, saveBook);

router.route('/login').post(login);

router.route('/me').get(authExpressMiddleware, getSingleUser);

router.route('/books/:bookId').delete(authExpressMiddleware, deleteBook);

module.exports = router;
