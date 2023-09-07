const router = require('express').Router();
const { userControllers } = require('../controllers');
const { verifyToken } = require("../middlewares/auth");
const { checkRegister, checkEmail, checkResetPassword } = require("../middlewares/validator");

router.post("/login", userControllers.login);
router.get("/keeplogin", verifyToken, userControllers.keepLogin);
router.post("/register", checkRegister, userControllers.register);
router.patch("/verification", verifyToken, userControllers.verificationAccount);
router.put("/", checkEmail, userControllers.forgotPassword);
router.patch("/reset", verifyToken, checkResetPassword, userControllers.resetPassword);

module.exports = router;