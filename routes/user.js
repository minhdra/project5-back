var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');
var verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/:_id', verifyToken, UserController.getById);
router.post('/search', verifyToken, UserController.search);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/change-password', verifyToken, UserController.changePassword);
router.post('/delete', verifyToken, UserController.delete);

module.exports = router;
