const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '../pharmashopfiles');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});
const uploadMult = multer({ storage: storage }).array('files', 10);

module.exports = uploadMult