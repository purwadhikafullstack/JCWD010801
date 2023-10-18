const path = require("path");
const router = require("express").Router();
const { productControllers } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");
const { multerUpload } = require("../middlewares/multer");

router.post("/", multerUpload(path.join(__dirname, "../public/products"), "P-IMG").single("image"), productControllers.addProduct);
router.post("/activation/:PID", productControllers.activateDeactivate);
router.post("/delete/:PID", productControllers.hardDelete);
router.post("/review/:PID", verifyToken, productControllers.reviewProduct);
router.patch("/like/:PID", productControllers.likeUnlike);
router.patch("/bulkcategory", productControllers.bulkUpdateCategory);
router.patch("/bulkdeactivate", productControllers.bulkDeactivate);
router.patch("/bulkactivate", productControllers.bulkActivate);
router.patch("/bulkdelete", productControllers.bulkDelete);(__dirname + "/public/products")
router.patch("/view/:PID", productControllers.addOneUserView);
router.patch("/:PID", multerUpload(path.join(__dirname, "../public/products"), "P-IMG").single("image"), productControllers.updateProduct);
router.get("/wishlist", productControllers.getUserWishlist);
router.get("/all", productControllers.getAllProducts);
router.get("/random", productControllers.getRandomProductName);
router.get("/suggestions", productControllers.getProductSuggestions);
router.get("/alladmin", productControllers.getAllProductsAdmin);
router.get("/active", productControllers.getActiveProducts);
router.get("/deactivated", productControllers.getDeactivatedProducts);
router.get("/deleted", productControllers.getDeletedProducts);
router.get("/similar/:CID", productControllers.getSimilarProducts);
router.get("/review/:PID", productControllers.getProductReviews);
router.get("/like/:PID", productControllers.getLikeStatus);
router.get("/stock/:id", productControllers.getBranchStock);
router.get("/:id", productControllers.getProduct);

module.exports = router;
