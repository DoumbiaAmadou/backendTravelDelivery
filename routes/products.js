const express = require('express');
const router = express();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const Product = require('../models/products');
const multer = require('multer');
const path = require('path')


var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		const match = ["image/png", "image/jpeg"];

		if (match.indexOf(file.mimetype) === -1) {
			return cb(new Error('file Not Accepted ' + file.mimetype), null)
		}

		let newFileName = new Date().toISOString().replace(/:/g, '-') + file.originalname
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
var upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 9.5 }, filter: customfilter })

router.get('/', (req, res, next) => {
	Product.find()
		.exec()
		.then(product => {
			const response = {
				count: product.length,
				product: product.map(({ _id, name, price, images }) => ({
					_id,
					name,
					price,
					images,
					request: {
						type: 'GET',
						url: '' + process.env.BASE_URL + 'product/' + _id
					}
				})
				)
			};
			console.log(JSON.stringify(response));
			res.status(201).json(response)

		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});

});

router.post('/', upload.array('avatarsProduct', 4), (req, res, next) => {

	//TODO   add file  url om product here! 
	console.log('ici', req.files);
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		images: req.files.map(({ path, destination, filename }) => {
			return process.env.BASE_URL + destination + filename;
		})
	});
	product.save()
		.then((result) => {
			console.log("Saved", result);
		})
		.catch((err) => {
			res.status(401).json({
				message: " can not Create Porduct "
			})
		})

	res.status(201).json({
		message: 'Handle POST Requests to /product',
		createdUser: product
	});
});

router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;
	const product = Product.findById(id)
		.exec()
		.then(product => {
			if (product == null) {
				return res.status(404).json({ error: 'No valid product found' });
			}
			console.log(product)
			res.status(201).json(product)

		})
		.catch(err => {
			console.log(err);

			res.status(500).json({ error: err });
		});
});

router.patch('/:productId', (req, res, next) => {
	const id = req.params.productId;
	if (id == 'special') {
		res.status(200).json({
			message: 'you discouvert the special'
		});
	} else {
		res.status(201).json({
			message: 'you can try again'
		});
	}
});

router.delete('/:productId', (req, res, next) => {
	const id = req.params.productId;
	if (id == 'special') {
		res.status(200).json({
			message: 'you discouvert the special'
		});
	} else {
		res.status(201).json({
			message: 'you can try again'
		});
	}
});

module.exports = router; 