const router = require("express").Router()
const {reportControllers} = require("../controllers")
const {verifyToken} = require("../middlewares/auth")

router.get("/", reportControllers.reportSuperAdmin)
router.get("/product", reportControllers.reportProduct)

module.exports = router