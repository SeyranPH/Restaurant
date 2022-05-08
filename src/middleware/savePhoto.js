const multer = require('multer');
const upload = multer({ dest: '../service' });

module.exports = upload.single('photo');