const express = require('express');
const router = express();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const checkRole = require('../middleware/check-role');
const Product = require('../models/products');
const upload = require('../middleware/multerHelper');
const path = require('path')

router.get('/', checkRole, (req, res, next) => {
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
	const updateOps = {};
	for (const ops of Object.keys(req.body)) {
		updateOps[ops] = req.body[ops]
	}
	console.log(" 1 => ", updateOps);
	Product.updateOne({ _id: id }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(id, result)
			res.status(201).json({
				message: "Product updated",
				request: {
					type: 'GET',
					url: '' + process.env.BASE_URL + 'product/' + id
				},
				response: result
			})
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

router.delete('/:productId', checkAuth, (req, res, next) => {
	const id = req.params.productId;
	Product.deleteOne({ _id: id })
		.exec()
		.then(result => {
			console.log(result.deletedCount)
			var returnmessage = {
				message: result.deletedCount + " Product Deleted"
			};
			if (result.deletedCount == 0) {
				returnmessage = {
					message: "No Product Found! "
				};
			}
			res.status(200).json(returnmessage)
		}).catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		})
});

module.exports = router; 