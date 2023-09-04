const router = require('express').Router();
const { productControllers } = require('../controllers');
const { verifyToken, checkRole } = require('../middlewares/auth');
const { multerUpload } = require("../middlewares/multer");

router.post('/', multerUpload(`./src/public/products`, 'P-IMG').single('image'), productControllers.addProduct);
router.post('/category', multerUpload(`./src/public/categories`, 'C-IMG').single('image'), productControllers.addCategory);
router.get('/all', productControllers.getAllProducts);
router.get('/categories', productControllers.getCategories);
router.get('/category/:id', productControllers.getCategoryById);
router.get('/:id', productControllers.getProduct);
router.get('/category/:id', productControllers.getProductsByCategory);

module.exports = router;