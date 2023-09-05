const router = require('express').Router();
const { adminControllers } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");

router.post("/adminregister", adminControllers.adminRegister);
router.get("/allAdmins", adminControllers.getAllAdmins);
router.get("/getadmin/:id", adminControllers.getAdmin);

module.exports = router;