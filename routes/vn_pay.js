var express = require('express');
var router = express.Router();
var VnPayController = require('../controllers/VnPayController');
var verifyTokenClient = require('../middleware/verifyTokenClient');

/* GET users listing. */
router.post('/create_payment_url', VnPayController.create_payment_url);
// router.get('/getById/:_id', StaffController.getById);
// router.get('/getByUserId/:_id', verifyToken, StaffController.getByUserId);
// router.post('/search', verifyToken, StaffController.search);
// router.post('/delete', verifyToken, StaffController.delete);
// router.post('/update', verifyToken, StaffController.update);

module.exports = router;
