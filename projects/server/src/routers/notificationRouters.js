const router = require('express').Router();
const { notificationControllers } = require('../controllers');
const { verifyToken, checkUser } = require('../middlewares/auth');

router.get('/', verifyToken, checkUser, notificationControllers.getNotifications);
router.delete('/', verifyToken, checkUser, notificationControllers.clearNotifications);
router.patch('/:id', verifyToken, checkUser, notificationControllers.readNotification);
router.delete('/:id', verifyToken, checkUser, notificationControllers.deleteNotification);

module.exports = router;