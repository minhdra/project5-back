var express = require('express');
var router = express.Router();
var CategoryController = require('../controllers/CategoryController');
var verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/getById/:_id', CategoryController.getById);
router.post('/search', CategoryController.search);
router.post('/getByPath', CategoryController.getByPath);
router.post('/searchMenu', CategoryController.searchForMenu);
router.post('/create', verifyToken, CategoryController.create);
router.post('/delete', verifyToken, CategoryController.delete);
router.post('/update', verifyToken, CategoryController.update);

module.exports = router;
