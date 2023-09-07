const router = require("express").Router();
const { adminControllers } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");

router.get("/alladmins", adminControllers.getAllAdmins);
router.get("/getbranches", adminControllers.getBranches);
router.get("/getadmin/:id", adminControllers.getAdmin);
router.post("/login", adminControllers.login);
router.post("/register", adminControllers.adminRegister);

module.exports = router;
