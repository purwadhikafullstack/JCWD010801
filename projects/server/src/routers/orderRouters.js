const router = require("express").Router();
const { orderControllers } = require("../controllers");
const { verifyToken, checkUser } = require("../middlewares/auth");
const { multerUpload } = require("../middlewares/multer");

router.get("/", verifyToken, orderControllers.ordersList);
router.get("/branchadmin", verifyToken, orderControllers.branchAdminOrdersList);
router.get("/superAdmin", verifyToken, orderControllers.superAdminOrdersList);
router.post("/", verifyToken, orderControllers.order);
router.post("/shipment", orderControllers.shipment);
router.get("/latest-id", orderControllers.getLatestId);
router.patch("/proof/:id", verifyToken, checkUser, multerUpload(`./src/public/orders`, "O-IMG").single("image"), orderControllers.uploadPaymentProof);
router.patch("/cancel/:id", verifyToken, checkUser, orderControllers.userCancelOrder);
router.patch("/expire/:id", verifyToken, checkUser, orderControllers.userAutoCancelOrder);
router.patch("/user-confirm/:id", verifyToken, checkUser, orderControllers.userConfirmOrder);
router.patch("/auto-confirm/:id", verifyToken, checkUser, orderControllers.userAutoConfirmOrder);


module.exports = router;
