const router = require("express").Router();
const { orderControllers } = require("../controllers");
const { verifyToken, checkUser } = require("../middlewares/auth");
const { multerUpload } = require("../middlewares/multer");

router.get("/", verifyToken, orderControllers.ordersList);
router.post("/", verifyToken, orderControllers.order);
router.post("/shipment", orderControllers.shipment);
router.patch("/proof/:id", verifyToken, checkUser, multerUpload(`./src/public/orders`, "O-IMG").single("image"), orderControllers.uploadPaymentProof);
router.patch("/cancel/:id", verifyToken, checkUser, orderControllers.userCancelOrder);


module.exports = router;
