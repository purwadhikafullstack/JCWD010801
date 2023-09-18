const router = require("express").Router();
const { productControllers } = require("../controllers");
const { multerUpload } = require("../middlewares/multer");

router.post("/", multerUpload(`./src/public/products`, "P-IMG").single("image"), productControllers.addProduct);
router.post("/activation/:PID", productControllers.activateDeactivate);
router.post("/delete/:PID", productControllers.hardDelete);
router.patch("/bulkcategory", productControllers.bulkUpdateCategory);
router.patch("/bulkdeactivate", productControllers.bulkDeactivate);
router.patch("/bulkactivate", productControllers.bulkActivate);
router.patch("/bulkdelete", productControllers.bulkDelete);
router.patch("/:PID", multerUpload(`./src/public/products`, "P-IMG").single("image"), productControllers.updateProduct);
router.get("/all", productControllers.getAllProducts);
router.get("/alladmin", productControllers.getAllProductsAdmin);
router.get("/active", productControllers.getActiveProducts);
router.get("/deactivated", productControllers.getDeactivatedProducts);
router.get("/deleted", productControllers.getDeletedProducts);
router.get("/stock/:id", productControllers.getBranchStock);
router.get("/:id", productControllers.getProduct);

module.exports = router;
