var express = require('express');
var router = express.Router();
var CategorySubController = require('../controllers/CategorySubController');
var verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/getById/:_id', CategorySubController.getById);
router.get('/getByPath/:path', CategorySubController.getByPath);
router.post('/search', CategorySubController.search);
router.post('/create', verifyToken, CategorySubController.create);
router.post('/delete', verifyToken, CategorySubController.delete);
router.post('/update', verifyToken, CategorySubController.update);

module.exports = router;
