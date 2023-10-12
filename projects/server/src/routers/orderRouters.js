const router = require("express").Router();
const { orderControllers } = require("../controllers");
const { verifyToken, checkUser } = require("../middlewares/auth");
const { multerUpload } = require("../middlewares/multer");

router.get("/", verifyToken, orderControllers.ordersList);
router.get("/branchadmin", verifyToken, orderControllers.branchAdminOrdersList);
router.get("/superAdmin", verifyToken, orderControllers.superAdminOrdersList);
router.get("/address", verifyToken, orderControllers.address)
router.post("/", verifyToken, orderControllers.order);
router.post("/shipment", orderControllers.shipment);
router.patch("/proof/:id", verifyToken, checkUser, multerUpload(`./src/public/orders`, "O-IMG").single("image"), orderControllers.uploadPaymentProof);
router.patch("/cancel/:id", verifyToken, checkUser, orderControllers.userCancelOrder);
router.patch("/user-confirm/:id", verifyToken, checkUser, orderControllers.userConfirmOrder);
router.patch("/auto-confirm/:id", verifyToken, checkUser, orderControllers.userAutoConfirmOrder);
router.patch("/send/:id", verifyToken, orderControllers.processingToSent);
router.patch("/payment-confirm/:id", verifyToken, orderControllers.paymentConfirmation);
router.patch("/received-confirmation/:id", verifyToken, orderControllers.receiveConfirmation);
router.patch("/reject-payment/:id", verifyToken, orderControllers.rejectPaymentProof);
router.patch("/cancel-by-admin/:id", verifyToken, orderControllers.cancelOrderByAdmin);


module.exports = router;
