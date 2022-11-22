var express = require('express');
var router = express.Router();
var CollectController = require('../controllers/CollectController');
var verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/getById/:_id', CollectController.getById);
router.get('/getByPath/:path', CollectController.getByPath);
router.post('/search', CollectController.search);
router.post('/create', verifyToken, CollectController.create);
router.post('/delete', verifyToken, CollectController.delete);
router.post('/update', verifyToken, CollectController.update);

module.exports = router;
