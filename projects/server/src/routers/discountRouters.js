const router = require("express").Router();
const { discountControllers } = require("../controllers");
const { verifyToken, checkAdmin } = require("../middlewares/auth");

router.post("/", verifyToken, checkAdmin, discountControllers.createBranchDiscount);
router.get("/", verifyToken, checkAdmin, discountControllers.getHistory);
router.patch("/", verifyToken, checkAdmin, discountControllers.updateBranchDiscount);
router.get("/ongoing", discountControllers.getOngoingDiscount);
router.get("/ongoing-admin", verifyToken, checkAdmin, discountControllers.getOngoingDiscountAdmin);
router.patch("/:id", verifyToken, checkAdmin, discountControllers.activateDiscount);
router.delete("/:id", verifyToken, checkAdmin, discountControllers.deactivateDiscount);

module.exports = router;