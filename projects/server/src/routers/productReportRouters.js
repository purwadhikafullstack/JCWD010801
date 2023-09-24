const router = require("express").Router();
const { productReportControllers } = require("../controllers");

router.get("/:id", productReportControllers.getProduct);

module.exports = router;
