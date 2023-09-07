const router = require("express").Router();
const { adminControllers } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");

router.post("/adminregister", adminControllers.adminRegister);
router.get("/alladmins", adminControllers.getAllAdmins);
router.get("/getadmin/:id", adminControllers.getAdmin);
router.get("/getbranches", adminControllers.getBranches);

module.exports = router;
