const router = require('express').Router();
const { adminControllers } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");


module.exports = router;