const router = require("express").Router();
const { productControllers } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");
const { multerUpload } = require("../middlewares/multer");

router.post("/", multerUpload(`./src/public/products`, "P-IMG").single("image"), productControllers.addProduct);
router.post("/activation/:PID", productControllers.activateDeactivate);
router.post("/delete/:PID", productControllers.hardDelete);
router.post("/review/:id", verifyToken, productControllers.reviewProduct);
router.patch("/like/:PID", productControllers.likeUnlike);
router.patch("/bulkcategory", productControllers.bulkUpdateCategory);
router.patch("/bulkdeactivate", productControllers.bulkDeactivate);
router.patch("/bulkactivate", productControllers.bulkActivate);
router.patch("/bulkdelete", productControllers.bulkDelete);
router.patch("/view/:PID", productControllers.addOneUserView);
router.patch("/:PID", multerUpload(`./src/public/products`, "P-IMG").single("image"), productControllers.updateProduct);
router.get("/wishlist", productControllers.getUserWishlist);
router.get("/all", productControllers.getAllProducts);
router.get("/random", productControllers.getRandomProductName);
router.get("/suggestions", productControllers.getProductSuggestions);
router.get("/alladmin", productControllers.getAllProductsAdmin);
router.get("/active", productControllers.getActiveProducts);
router.get("/deactivated", productControllers.getDeactivatedProducts);
router.get("/deleted", productControllers.getDeletedProducts);
router.get("/like/:PID", productControllers.getLikeStatus);
router.get("/stock/:id", productControllers.getBranchStock);
router.get("/:id", productControllers.getProduct);

module.exports = router;
