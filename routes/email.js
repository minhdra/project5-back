var express = require('express');
var router = express.Router();
var EmailController = require('../controllers/EmailController');

/* GET users listing. */
router.post('/send-contact', EmailController.sendMailContact);
router.post('/verify-account', EmailController.verifyAccount);

module.exports = router;
