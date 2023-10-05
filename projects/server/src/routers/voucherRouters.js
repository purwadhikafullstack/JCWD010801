const router = require("express").Router();
const { voucherControllers } = require("../controllers");
const { verifyToken, checkUser, checkAdmin, checkSuperAdmin } = require("../middlewares/auth");

router.post("/", verifyToken, checkAdmin, voucherControllers.createVoucher);
router.get("/", verifyToken, checkSuperAdmin, voucherControllers.getAllVouchers);
router.get("/user", verifyToken, checkUser, voucherControllers.getUserVouchers);
router.get("/branch", verifyToken, checkAdmin, voucherControllers.getBranchVouchers);
router.post("/redeem", verifyToken, checkUser, voucherControllers.redeemVoucherCode);
router.patch("/:id", verifyToken, checkUser, voucherControllers.useVoucher);

module.exports = router;