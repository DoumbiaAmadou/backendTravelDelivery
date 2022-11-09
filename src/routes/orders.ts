import { Router, Request, Response, NextFunction} from 'express';
const express = require('express');

const router: Router = express();
module.exports = router;
router.get('/', (req:Request, res :Response, next:NextFunction) => {
	res.status(200).json({
		message: 'Handle GET Requests to /order'
	});
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		message: 'Handle POST Requests to /order'
	});
});
router.get('/:orderId', (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.orderId;
	if (id == 'special') {
		res.status(200).json({
			message: 'you discouvert the special'
		});
	} else {
		res.status(200).json({
			message: 'you can try again'
		});
	}
});
router.patch('/:orderId', (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.orderId;
	if (id == 'special') {
		res.status(200).json({
			message: 'you discouvert the special'
		});
	} else {
		res.status(200).json({
			message: 'you can try again'
		});
	}
});
router.delete('/:orderId', (req: Request, res: Response, next:NextFunction) => {
	const id = req.params.productId;
	if (id == 'special') {
		res.status(200).json({
			message: 'you discouvert the special'
		});
	} else {
		res.status(200).json({
			message: 'you can try again'
		});
	}
});