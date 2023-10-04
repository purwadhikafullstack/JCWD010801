const router = require("express").Router();
const { adminControllers } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");

router.post("/", verifyToken, adminControllers.adminRegister);
router.post("/login", adminControllers.login);
router.post("/:UID", adminControllers.confirmPassword);
router.get("/all", adminControllers.getAllAdmins);
router.get("/branches", adminControllers.getBranches);
router.get("/infoAdmins", adminControllers.findAdminInfo);
router.get("/infoUsers", adminControllers.findUserInfo);

module.exports = router;
