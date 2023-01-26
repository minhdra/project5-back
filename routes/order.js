var express = require('express');
var router = express.Router();
var OrderController = require('../controllers/OrderController');
var verifyToken = require('../middleware/verifyToken');
var verifyTokenClient = require('../middleware/verifyTokenClient');

/* GET users listing. */
router.get('/get-by-id/:id', OrderController.getById);
router.post('/search-client', verifyTokenClient, OrderController.search);
router.post('/create-client', verifyTokenClient, OrderController.create);
router.post('/delete-client', verifyTokenClient, OrderController.delete);
router.post('/update-client', verifyTokenClient, OrderController.update);

router.get('/getById/:id', verifyToken, OrderController.getById);
router.post('/search', verifyToken, OrderController.search);
router.post('/create', verifyToken, OrderController.create);
router.post('/delete', verifyToken, OrderController.delete);
router.post('/update', verifyToken, OrderController.update);

module.exports = router;
