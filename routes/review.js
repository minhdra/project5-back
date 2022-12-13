var express = require('express');
var router = express.Router();
var ReviewController = require('../controllers/ReviewController');
var verifyToken = require('../middleware/verifyToken');
var verifyTokenClient = require('../middleware/verifyTokenClient');

/* GET users listing. */
router.get('/getById/:_id', ReviewController.getById);
router.get('/getByCustomer/:id', ReviewController.getByCustomer);
router.post('/getByProduct', ReviewController.getByProduct);
router.post('/search', ReviewController.search);
router.post('/checkCustomerReview', ReviewController.checkCustomerReview);
router.post('/getByCustomerAndProduct', ReviewController.getByCustomerAndProduct);
router.post('/create-client', verifyTokenClient, ReviewController.create);
router.post('/delete-client', verifyTokenClient, ReviewController.delete);
router.post('/update-client', verifyTokenClient, ReviewController.update);
router.post('/create', verifyToken, ReviewController.create);
router.post('/delete', verifyToken, ReviewController.delete);
router.post('/update', verifyToken, ReviewController.update);

module.exports = router;
