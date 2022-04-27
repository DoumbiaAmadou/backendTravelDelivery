const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      return cb(new Error('file Not Accepted ' + file.mimetype), null)
    }

    let newFileName = (Date.now() + file.originalname).replace(/([\s]|:)/gm, '_')
    cb(null, newFileName)

  }

})
const customfilter = (req, file, cb) => {
  console.log(file)
}
var upload = multer({ storage: storage, limits: { fileSize: 1080 * 1080 * 4 }, filter: customfilter })
module.exports = upload;

///([\s]|:)/gm