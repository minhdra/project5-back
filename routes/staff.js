var express = require('express');
var router = express.Router();
var StaffController = require('../controllers/StaffController');
var verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/getById/:_id', StaffController.getById);
router.get('/getByUserId/:_id', verifyToken, StaffController.getByUserId);
router.post('/search', verifyToken, StaffController.search);
router.post('/delete', verifyToken, StaffController.delete);
router.post('/update', verifyToken, StaffController.update);

module.exports = router;
