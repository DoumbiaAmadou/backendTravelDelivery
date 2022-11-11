import { Request,  NextFunction, Response } from 'express';
import multer, { FileFilterCallback } from 'multer'


const express = require('express');
const router = express();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const checkRole = require('../middleware/check-role');
const Product = require('../models/products');
const upload = require('../middleware/multerHelper');

interface ReturnResponse {
	count: number, 
	product: Product []
}
type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void
interface Product {
	_id:number,
	name : string,
	price: number,
	images : string
	request: any
}
interface Result {
	deletedCount : number 
}
router.get('/', checkRole, (req : Request, res : Response, next: NextFunction) => {
	Product.find()
		.exec()
		.then((product : Product[]) => {
			const response: ReturnResponse = {
				count: product.length,
				product: product.map(({ _id, name, price, images }) => ({
					_id,
					name,
					price,
					images,
					request: {
						type: 'GET',
						url: '' + process.env.BASE_URL + '/product/' + _id
					}
				})
				)
			};
			console.log(JSON.stringify(response));
			res.status(201).json(response) ; 
		})
		.catch((err: Error) => {
			console.log(err);
			res.status(500).json({ error: err });
		});

});

router.post('/', upload.array('avatarsProduct', 4), (req: Request , res: Response, next: NextFunction) => {

	//TODO   add file  url om product here!  
	// console.log('ici', req.files);
	const files = req.files as Express.Multer.File[]
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		images: files.map(({path, destination, filename} : any ) => {
			return destination + filename;
		})
	});
	product.save()
		.then((result : Response<string>) => {
			console.log("Saved", result);
		})
		.catch((err: any ) => {
			res.status(401).json({
				message: " can not Create Porduct "
			})
		})

	res.status(201).send({
		message: 'Handle POST Requests to /product',
		createdUser: product
	});
});

router.get('/:productId', (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.productId;
	const product = Product.findById(id)
		.exec()
		.then((product : any) => {
			if (product == null) {
				return res.status(404).json({ error: 'No valid product found' });
			}
			console.log(product)
			res.status(201).json(product)

		})
		.catch((err: any) => {
			console.log(err);

			res.status(500).json({ error: err });
		});
});

router.patch('/:productId', (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.productId;
	const updateOps : any = {};
	for (const ops of Object.keys(req.body)) {
		updateOps[ops] = req.body[ops]
	}
	console.log(" 1 => ", updateOps);
	Product.updateOne({ _id: id }, { $set: updateOps })
		.exec()
		.then((result:any) => {
			console.log(id, result)
			res.status(201).json({
				message: "Product updated",
				request: {
					type: 'GET',
					url: '' + process.env.BASE_URL + '/product/' + id
				},
				response: result
			})
		})
		.catch((err:any) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

router.delete('/:productId', checkAuth, (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.productId;
	Product.deleteOne({ _id: id })
		.exec()
		.then((result: Result) => {
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
		}).catch((e: any )=> {
			console.log(e);
			res.status(500).json({
				error: e
			});
		})
});

module.exports = router; 