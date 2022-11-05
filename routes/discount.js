var express = require('express');
var router = express.Router();
var DiscountController = require('../controllers/DiscountController');
var verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/getById/:_id', verifyToken, DiscountController.getById);
router.post('/search', verifyToken, DiscountController.search);
router.post('/create', verifyToken, DiscountController.create);
router.post('/delete', verifyToken, DiscountController.delete);
router.post('/update', verifyToken, DiscountController.update);

module.exports = router;
