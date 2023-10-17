const path = require("path");
const router = require('express').Router();
const { categoryControllers } = require('../controllers');
const { verifyToken, checkAdmin } = require('../middlewares/auth');
const { multerUpload } = require("../middlewares/multer");

router.post('/', verifyToken, checkAdmin, multerUpload(path.join(__dirname, "../public/categories"), 'C-IMG').single('image'), categoryControllers.addCategory);
router.get('/user', categoryControllers.getCategoriesUser);
router.get('/admin', verifyToken, checkAdmin, categoryControllers.getCategoriesAdmin);
router.get('/:id', categoryControllers.getCategoryById);
router.patch('/:id', verifyToken, checkAdmin, multerUpload(path.join(__dirname, "../public/categories"), 'C-IMG').single('image'), categoryControllers.updateCategory);
router.delete('/:id', verifyToken, checkAdmin, categoryControllers.deleteCategory);
router.put('/:id', verifyToken, checkAdmin, categoryControllers.restoreCategory);

module.exports = router;