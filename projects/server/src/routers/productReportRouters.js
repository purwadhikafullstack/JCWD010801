const router = require("express").Router();
const { productReportControllers } = require("../controllers");

router.get("/", productReportControllers.getProductReport);
router.get("/changelogs", productReportControllers.getChangelogs);
router.get("/product/currentAggregate", productReportControllers.getProductAggregateStock);
router.get("/product/trackAggregate", productReportControllers.trackAggregateStockChangesByDate);
router.get("/categories/all", productReportControllers.getAllProductsDataInCategories);
router.get("/categories/average", productReportControllers.getAverageProductsPerCategory);
router.get("/categories/mostandleast", productReportControllers.mostAndLeast);
router.get("/categories/statuscounts", productReportControllers.getProductStatusCountsByCategory);
router.get("/categories/statusaverages", productReportControllers.getProductStatusAverages);
router.get("/branches/mostandleast", productReportControllers.getBranchesProductCount);
router.get("/branches/tx", productReportControllers.getBranchesTransactionCount);
router.get("/levels", productReportControllers.getAllStocks);

module.exports = router;
