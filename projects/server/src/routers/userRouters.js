const router = require('express').Router();
const { userControllers } = require('../controllers');
const { verifyToken } = require("../middlewares/auth");

router.post("/userlogin", userControllers.userLogin);
router.get("/keeplogin", verifyToken, userControllers.keepLogin);

module.exports = router;