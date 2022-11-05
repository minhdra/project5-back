var express = require('express');
var router = express.Router();
var SlideController = require('../controllers/SlideController');
var verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.get('/:_id', SlideController.getById);
router.post('/search', SlideController.search);
router.post('/create', verifyToken, SlideController.create);
router.post('/delete', verifyToken, SlideController.delete);
router.post('/update', verifyToken, SlideController.update);

module.exports = router;
