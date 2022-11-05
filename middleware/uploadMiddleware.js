// uploadMiddleware.js
const { v4: uuidv4 } = require('uuid');

const multer = require('multer');

// SET STORAGE
var storage = multer.diskStorage({
  destination: './public/images',
  filename: function (req, file, cb) {
    let ext = '';
    switch (file.mimetype) {
      case 'image/jpeg':
        ext = '.jpeg';
        break;
      case 'image/png':
        ext = '.png';
        break;
    }
    const uniqueSuffix = uuidv4();
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  // limits: {
  //   fileSize: 4 * 1024 * 1024,
  // },
  // dest: "public/images",
  storage: storage,
});

module.exports = upload;
