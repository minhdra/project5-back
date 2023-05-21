var express = require('express');
var router = express.Router();
var NavigationController = require('../controllers/NavigationController');
var verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/getById/:_id', NavigationController.getById);
router.post('/search', NavigationController.search);
router.post('/update', verifyToken, NavigationController.update);
router.post('/create', verifyToken, NavigationController.create);
router.post('/delete', verifyToken, NavigationController.delete);

module.exports = router;
