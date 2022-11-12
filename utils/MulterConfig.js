const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    let fileFormat = file.mimetype.split("/");
    let fileName = Date.now() + "." + fileFormat[fileFormat.length - 1];
    cb(null, fileName);
  },
});

module.exports = {
    multerUpload: multer({ storage: storage })
}