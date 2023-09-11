const router = require('express').Router();
const { productControllers } = require('../controllers');
const { verifyToken, checkRole } = require('../middlewares/auth');
const { multerUpload } = require("../middlewares/multer");

router.post('/', multerUpload(`./src/public/products`, 'P-IMG').single('image'), productControllers.addProduct);
router.get('/all', productControllers.getAllProducts);
router.get('/active', productControllers.getActiveProducts);
router.get('/deactivated', productControllers.getDeactivatedProducts);
router.get('/:id', productControllers.getProduct);

module.exports = router;