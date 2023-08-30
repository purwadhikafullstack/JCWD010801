const router = require('express').Router();
const authControllers = require("../controllers/authControllers");
const { verifyToken } = require("../middleware/auth");


module.exports = router;