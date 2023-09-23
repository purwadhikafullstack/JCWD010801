const router = require("express").Router();
const { productReportControllers } = require("../controllers");

router.get("/", productReportControllers.getProductReport);
router.get("/categories/all", productReportControllers.getAllProductsDataInCategories);
router.get("/categories/mostandleast", productReportControllers.mostAndLeast);

module.exports = router;
