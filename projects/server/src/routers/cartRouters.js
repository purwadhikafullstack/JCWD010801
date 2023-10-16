const router = require('express').Router();
const { cartControllers } = require('../controllers');
const { verifyToken, checkUser } = require('../middlewares/auth');

router.post('/', verifyToken, checkUser, cartControllers.addToCart);
router.patch('/branch', verifyToken, checkUser, cartControllers.switchBranch);
router.get('/', verifyToken, checkUser, cartControllers.getCartItems);
router.patch('/', verifyToken, checkUser, cartControllers.updateQuantity);
router.delete('/', verifyToken, checkUser, cartControllers.clearCart);
router.delete('/:id', verifyToken, checkUser, cartControllers.removeItem);

module.exports = router;