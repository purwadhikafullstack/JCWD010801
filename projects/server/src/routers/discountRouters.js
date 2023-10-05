const router = require("express").Router();
const { discountControllers } = require("../controllers");
const { verifyToken, checkAdmin } = require("../middlewares/auth");

router.post("/", verifyToken, checkAdmin, discountControllers.createBranchDiscount);
router.get("/", verifyToken, checkAdmin, discountControllers.getHistory);
router.patch("/", verifyToken, checkAdmin, discountControllers.updateBranchDiscount);
router.get("/ongoing", verifyToken, checkAdmin, discountControllers.getOngoingDiscount);

module.exports = router;