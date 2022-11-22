var express = require('express');
var router = express.Router();
var InvoiceController = require('../controllers/InvoiceController');
var verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/getById/:_id', InvoiceController.getById);
router.post('/search', verifyToken, InvoiceController.search);
router.post('/update', verifyToken, InvoiceController.update);
router.post('/create', verifyToken, InvoiceController.create);
router.post('/delete', verifyToken, InvoiceController.delete);

module.exports = router;
