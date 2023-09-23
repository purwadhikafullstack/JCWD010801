const router = require("express").Router();
const { productReportControllers } = require("../controllers");

router.get("/", productReportControllers.getProductReport);

module.exports = router;
