const router = require("express").Router();
const { orderControllers } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");

router.get("/", verifyToken, orderControllers.ordersList);
router.post("/shipment", orderControllers.shipment);

module.exports = router;
