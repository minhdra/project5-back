var express = require('express');
var router = express.Router();
var ImageController = require('../controllers/ImageController');
var upload = require('../middleware/uploadMiddleware');
var fileUploader = require('../configs/cloudinary.config');
var verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.post('/upload', verifyToken, upload.single('file'), ImageController.uploadSingle);
router.post('/cloudinary-upload', verifyToken, fileUploader.single('file'), ImageController.uploadSingle);
router.post('/remove', verifyToken, ImageController.remove);

module.exports = router;
