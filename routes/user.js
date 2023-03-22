var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');
var verifyToken = require('../middleware/verifyToken');
var verifyTokenClient = require('../middleware/verifyTokenClient');

/* GET users listing. */
router.get('/:_id', verifyToken, UserController.getById);
router.get('/client/get-by-id/:_id', UserController.getByIdClient);
router.post('/search', verifyToken, UserController.search);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/refresh-token', UserController.requestRefreshToken);
router.post('/verify', UserController.verifyUser);
router.post('/reset-password', UserController.resetPassword);
router.post('/change-password-client', verifyTokenClient, UserController.changePassword);
router.post('/change-password', verifyToken, UserController.changePassword);
router.post('/delete', verifyToken, UserController.delete);

module.exports = router;
