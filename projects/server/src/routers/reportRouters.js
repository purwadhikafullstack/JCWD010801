const router = require("express").Router();
const { reportControllers } = require("../controllers");

router.get("/", reportControllers.reportSales);

module.exports = router;
