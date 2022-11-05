var express = require('express');
var router = express.Router();
var PaymentController = require('../controllers/PaymentController');
var verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/getById/:_id', verifyToken, PaymentController.getById);
router.get('/getById/:id', verifyToken, PaymentController.getByUserId);
router.post('/search', verifyToken, PaymentController.search);
router.post('/create', verifyToken, PaymentController.create);
router.post('/delete', verifyToken, PaymentController.delete);
router.post('/update', verifyToken, PaymentController.update);

module.exports = router;
