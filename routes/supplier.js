var express = require('express');
var router = express.Router();
var SupplierController = require('../controllers/SupplierController');
var verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/getById/:_id', SupplierController.getById);
router.post('/search', verifyToken, SupplierController.search);
router.post('/create', verifyToken, SupplierController.create);
router.post('/delete', verifyToken, SupplierController.delete);
router.post('/update', verifyToken, SupplierController.update);

module.exports = router;
