const router = require("express").Router();
const { reportControllers } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");

router.get("/", verifyToken, reportControllers.reportSales);

module.exports = router;
