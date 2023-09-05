const router = require('express').Router();
const { userControllers } = require('../controllers');
const { verifyToken } = require("../middlewares/auth");
const { checkRegister, checkEmail, checkResetPassword } = require("../middlewares/validator");

router.post("/userlogin", userControllers.userLogin);
router.post("/adminlogin", userControllers.adminLogin);
router.get("/keeplogin", verifyToken, userControllers.keepLogin);
router.post("/register", checkRegister, userControllers.register);
router.patch("/verification", verifyToken, userControllers.verificationAccount);
router.put("/", checkEmail, userControllers.forgotPassword);
router.patch("/reset", checkResetPassword, userControllers.resetPassword);

module.exports = router;