const router = require("express").Router();
const { addressControllers } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");

router.post("/", verifyToken, addressControllers.addAddress);
router.get("/", verifyToken, addressControllers.address);
router.get("/city", addressControllers.city);
router.get("/province", addressControllers.province);
router.patch("/main/:id", verifyToken, addressControllers.mainAddress);
router.patch("/:id", verifyToken, addressControllers.updateAddress);
router.delete("/:id", verifyToken, addressControllers.deleteAddress);

module.exports = router;
