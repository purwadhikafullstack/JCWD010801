const router = require("express").Router();
const { verifyToken, checkAdmin } = require("../middlewares/auth");
const { branchControllers } = require("../controllers");

router.get("/", verifyToken, checkAdmin, branchControllers.getAllBranches);

module.exports = router;
