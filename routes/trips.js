const express = require('express');
const router = express();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const Trips = require('../models/trips');
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

    let newFileName = Date.now() + file.originalname
    cb(null, newFileName)

  }

})
const customfilter = (req, file, cb) => {
  console.log(file)
}
var upload = multer({ storage: storage, limits: { fileSize: 1080 * 1080 * 4 }, filter: customfilter })

router.get('/', (req, res, next) => {
  Trips.find()
    .exec()
    .then(trip => {
      const response = {
        count: trip.length,
        trip: trip.map(({ _id, name, description, cityFrom,
          cityTo, departureDate, arrivaldate, kiloPrice, avalaiblekilos, tripsStatus, reservation, images }) => ({
            _id, name, description, cityFrom,
            cityTo, departureDate, arrivaldate, kiloPrice, avalaiblekilos, tripsStatus, reservation, images,
            request: {
              type: 'GET',
              url: '' + process.env.BASE_URL + 'trips/' + _id
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

router.post('/', upload.array('tripsImage', 4), (req, res, next) => {
  //TODO   add file  url om trips here! 
  console.log('ici', req.files);
  const { name, description,
    cityFrom, cityTo,
    departureDate, arrivaldate,
    kiloPrice, avalaiblekilos, tripsStatus, reservation, images
  } = req.body;
  const trips = new Trips({
    _id: new mongoose.Types.ObjectId(),
    name, description, cityFrom, cityTo, departureDate, arrivaldate, kiloPrice, avalaiblekilos, tripsStatus, reservation,
    images: req.files.map(({ path, destination, filename }) => {
      return process.env.BASE_URL + destination + filename;
    })
  });
  console.log('cityFrom ' + req.body.cityFrom);
  trips.save()
    .then((result) => {
      console.log("Saved", result);
    })
    .catch((err) => {
      res.status(401).json({
        message: " can not Create Porduct "
      })
    })

  res.status(201).json({
    message: 'Handle POST Requests to /trips',
    createdUser: trips
  });
});

router.get('/:tripsId', (req, res, next) => {
  const id = req.params.tripsId;
  const trips = trips.findById(id)
    .exec()
    .then(trips => {
      if (trips == null) {
        return res.status(404).json({ error: 'No valid trip found' });
      }
      console.log(trips)
      res.status(201).json(trips)

    })
    .catch(err => {
      console.log(err);

      res.status(500).json({ error: err });
    });
});

router.patch('/:tripsId', (req, res, next) => {
  const id = req.params.tripsId;
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

router.delete('/:tripsId', (req, res, next) => {
  const id = req.params.tripsId;
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