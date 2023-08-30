const router = require('express').Router();
const userControllers = require("../controllers");
const { verifyToken } = require("../middlewares/auth");


module.exports = router;