var express = require('express');
var router = express.Router();
var ProductController = require('../controllers/ProductController');
var verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/getById/:_id', ProductController.getById);
router.get('/getByPath/:path', ProductController.getByPath);
router.post('/search', ProductController.search);
router.post('/searchBySubCategory', ProductController.searchBySubCategory);
router.post('/create', verifyToken, ProductController.create);
router.post('/delete', verifyToken, ProductController.delete);
router.post('/update', verifyToken, ProductController.update);

module.exports = router;
