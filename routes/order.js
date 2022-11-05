var express = require('express');
var router = express.Router();
var OrderController = require('../controllers/OrderController');
var verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/getById/:id', verifyToken, OrderController.getById);
router.post('/search', verifyToken, OrderController.search);
router.post('/create', verifyToken, OrderController.create);
router.post('/delete', verifyToken, OrderController.delete);
router.post('/update', verifyToken, OrderController.update);

module.exports = router;
