const express = require('express');
const router = express();

module.exports = router; 
router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'Handle GET Requests to /order'
	});
});

router.post('/', (req, res, next) => {
	res.status(200).json({
		message: 'Handle POST Requests to /order'
	});
});
router.get('/:orderId', (req, res, next) => {
	const id = req.params.orderId;
	if (id == 'special') {
		res.status(200).json({
			message: 'you discouvert the special'
		});
	}else{
		res.status(200).json({
			message: 'you can try again'
		});
	}
});
router.patch('/:orderId', (req, res, next) => {
	const id = req.params.orderId;
	if (id == 'special') {
		res.status(200).json({
			message: 'you discouvert the special'
		});
	}else{
		res.status(200).json({
			message: 'you can try again'
		});
	}
});
router.delete('/:orderId', (req, res, next) => {
		const id = req.params.productId;
		if (id == 'special') {
			res.status(200).json({
				message: 'you discouvert the special'
			});
		}else{
			res.status(200).json({
				message: 'you can try again'
			});
		}
});