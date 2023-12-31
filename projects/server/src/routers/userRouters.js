const path = require("path");
const router = require("express").Router();
const { userControllers } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");
const { checkRegister, checkEmail, checkResetPassword, checkChangePassword, checkUpdateEmail, checkUpdatePhone } = require("../middlewares/validator");
const { multerUpload } = require("../middlewares/multer");

router.post("/", checkRegister, userControllers.register);
router.post("/login", userControllers.login);
router.post("/avatar", verifyToken, multerUpload(path.join(__dirname, "../public/avatars"), 'AV-IMG').single("file"), userControllers.updateAvatar);
router.get("/keeplogin", verifyToken, userControllers.keepLogin);
router.put("/", checkEmail, userControllers.forgotPassword);
router.patch("/verification", verifyToken, userControllers.verificationAccount);
router.patch("/reset", verifyToken, checkResetPassword, userControllers.resetPassword);
router.patch("/profile", verifyToken, userControllers.updateProfile);
router.patch("/email", checkUpdateEmail, verifyToken, userControllers.updateEmail);
router.patch("/phone", checkUpdatePhone, verifyToken, userControllers.updatePhone);
router.patch("/password", verifyToken, checkChangePassword, userControllers.changePassword);
router.patch("/reverify", verifyToken, userControllers.resendVerificationEmail);

module.exports = router;
