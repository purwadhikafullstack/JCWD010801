const router = require("express").Router();
const { orderControllers } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");
const { multerUpload } = require("../middlewares/multer");

router.patch("/proof/:id", verifyToken, multerUpload(`./src/public/orders`, "O-IMG").single("image"), orderControllers.uploadPaymentProof);

module.exports = router;
