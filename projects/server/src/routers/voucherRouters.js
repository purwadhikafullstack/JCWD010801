const router = require("express").Router();
const { voucherControllers } = require("../controllers");
const { verifyToken, checkUser, checkAdmin } = require("../middlewares/auth");

router.post("/", verifyToken, checkAdmin, voucherControllers.createVoucher);
router.get("/", verifyToken, checkAdmin, voucherControllers.getAllVoucher);
router.get("/user", verifyToken, checkUser, voucherControllers.getUserVouchers);
router.post("/redeem", verifyToken, checkUser, voucherControllers.redeemVoucherCode);
router.patch("/:id", verifyToken, checkUser, voucherControllers.useVoucher);

module.exports = router;