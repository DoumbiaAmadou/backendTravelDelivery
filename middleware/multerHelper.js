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
		//TODO: check systems file naming limitation here! 
		let newFileName = new Date().toISOString().replace(/:|[\s]/g, '-') + file.originalname
		console.log('newFileName  ==>' + newFileName)
		cb(null, newFileName)

	}

})
const customfilter = (req, file, cb) => {
	console.log(file)
	if (file.minetype === 'image/jpeg' || file.minetype === 'image/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}

}
 module.exports  = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 9.5 }, filter: customfilter })

