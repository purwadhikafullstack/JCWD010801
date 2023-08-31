const router = require('express').Router();
const { productControllers } = require('../controllers');
const { verifyToken, checkRole } = require('../middlewares/auth');
const { multerUpload } = require("../middlewares/multer");

router.post('/', multerUpload(`./src/public/products`, 'P-IMG').single('imgURL'), productControllers.addProduct);
router.post('/category', multerUpload(`./src/public/categories`, 'C-IMG').single('imgURL'), productControllers.addCategory);
router.get('/all', productControllers.getAllProducts);
router.get('/categories', productControllers.getCategories);
router.get('/:id', productControllers.getProduct);
router.get('/category/:id', productControllers.getProductsByCategory);

module.exports = router;