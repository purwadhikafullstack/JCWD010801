const router = require("express").Router();
const { orderControllers } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");

router.get("/", verifyToken, orderControllers.ordersList);
router.get("/", verifyToken, orderControllers.order);
router.post("/shipment", orderControllers.shipment);
router.patch("/",verifyToken, orderControllers.checkout);

module.exports = router;
