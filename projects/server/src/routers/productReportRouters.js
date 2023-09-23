const router = require("express").Router();
const { productReportControllers } = require("../controllers");

router.get("/", productReportControllers.getProductReport);
router.get("/categories/all", productReportControllers.getAllProductsDataInCategories);
router.get("/categories/average", productReportControllers.getAverageProductsPerCategory);
router.get("/categories/mostandleast", productReportControllers.mostAndLeast);
router.get("/categories/statusCounts", productReportControllers.getProductStatusCountsByCategory);
router.get("/categories/statusAverages", productReportControllers.getProductStatusAverages);

module.exports = router;
