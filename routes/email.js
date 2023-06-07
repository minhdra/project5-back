var express = require('express');
var router = express.Router();
var EmailController = require('../controllers/EmailController');

/* GET users listing. */
router.post('/send-contact', EmailController.sendMailContact);
router.post('/send-subscribe', EmailController.sendSubscribe);
router.post('/send-order', EmailController.sendWhenOrder);
router.post('/send-status-order', EmailController.sendChangeStatusOrder);
router.post('/verify-account', EmailController.verifyAccount);
router.post('/send-reset-password', EmailController.resetPassword);

module.exports = router;
