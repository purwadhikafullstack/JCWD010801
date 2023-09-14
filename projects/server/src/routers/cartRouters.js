const router = require('express').Router();
const { cartControllers } = require('../controllers');
const { verifyToken, checkUser } = require('../middlewares/auth');

router.post('/', verifyToken, checkUser, cartControllers.addToCart);
router.put('/', verifyToken, checkUser, cartControllers.switchBranch);
router.get('/', verifyToken, checkUser, cartControllers.getCartItems);

module.exports = router;