const router = require('express').Router();
const { authControllers } = require("../controllers/authControllers");
const { verifyToken } = require("../middlewares/auth");


module.exports = router;