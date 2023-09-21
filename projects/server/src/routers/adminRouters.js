const router = require("express").Router();
const { adminControllers } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");

router.post("/", verifyToken, adminControllers.adminRegister);
router.post("/login", adminControllers.login);
router.post("/:UID", adminControllers.confirmPassword);
router.get("/all", adminControllers.getAllAdmins);
router.get("/branches", adminControllers.getBranches);
router.get("/:id", adminControllers.getAdmin);

module.exports = router;
