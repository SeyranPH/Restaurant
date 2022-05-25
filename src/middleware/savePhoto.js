const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: '../../tmp/uploads' });


async function savePhoto(req, res, next) {
    await fs.writeFile('../../tmp/uploads/image', Buffer.from(req.body.photo, 'base64'), (err) => {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        next();
    });
    
}

module.exports = savePhoto;

