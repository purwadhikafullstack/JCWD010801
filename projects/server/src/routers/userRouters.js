const router = require('express').Router();
const userControllers = require('../controllers/userControllers');
const { verifyToken } = require("../middlewares/auth");

router.post("/userlogin", userControllers.userLogin);

module.exports = router;