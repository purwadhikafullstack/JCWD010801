const router = require('express').Router();
const { userControllers } = require('../controllers');
const { verifyToken } = require("../middlewares/auth");

router.post("/userlogin", userControllers.userLogin);
router.post("/adminlogin", userControllers.adminLogin);
router.get("/keeplogin", verifyToken, userControllers.keepLogin);

module.exports = router;