var express = require('express');
var router = express.Router();
var BrandController = require('../controllers/BrandController');
var verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/getById/:_id', BrandController.getById);
router.get('/getByPath/:path', BrandController.getByPath);
router.post('/search', BrandController.search);
router.post('/create', verifyToken, BrandController.create);
router.post('/delete', verifyToken, BrandController.delete);
router.post('/update', verifyToken, BrandController.update);

module.exports = router;
