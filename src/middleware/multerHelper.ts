const multerStorage = require('multer');
import multer, { FileFilterCallback } from 'multer'
import { Request, NextFunction, Response } from 'express';

var storage = multerStorage.diskStorage({
	destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string | null) => void) {
		cb(null, 'uploads/')
	},
	filename: function (req: Request, file: Express.Multer.File, cb:  (error: Error |null, destination:string |null ) => void ) {
		const match : string[] = ["image/png", "image/jpeg"];
		if (match.indexOf(file.mimetype) === -1) {
			return cb(new Error('file Not Accepted ' + file.mimetype), null)
		}
		//TODO: check systems file naming limitation here! 
		let newFileName: string = new Date().toISOString().replace(/:|[\s]/g, '-') + file.originalname
		// let newFileName = (Date.now() + file.originalname).replace(/([\s]|:)/gm, '_')
		console.log('newFileName  ==>' + newFileName)
		cb(null, newFileName)

	}
})

const customfilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback ) => {
	console.log(file)
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}
}

module.exports = multer({ 
	storage: storage, 
	limits: { fileSize: 1024 * 1024 * 9.5 } , 
	filter: customfilter 
} as multer.Options )

