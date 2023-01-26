var express = require('express');
var router = express.Router();
var ImageController = require('../controllers/ImageController');
var upload = require('../middleware/uploadMiddleware');
var fileUploader = require('../config/cloudinary.config');
var verifyToken = require('../middleware/verifyToken');
var verifyTokenClient = require('../middleware/verifyTokenClient');

/* GET users listing. */
// router.post('/upload', verifyToken, upload.single('file'), ImageController.uploadSingle);
router.post('/client-upload', verifyTokenClient, fileUploader.single('file'), ImageController.uploadSingle);
router.post('/cloudinary-upload', verifyToken, fileUploader.single('file'), ImageController.uploadSingle);
router.post('/cloudinary-multi-upload', fileUploader.array('files'), ImageController.uploadMultipleCloudinary);
router.post('/remove', verifyToken, ImageController.remove);

module.exports = router;
