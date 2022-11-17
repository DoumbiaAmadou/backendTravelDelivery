const express = require('express');
const router = express();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const { Trips, Reservation } = require('../models/trips');
const upload = require('../middleware/multerHelper');
const path = require('path')



router.get('/', (req, res, next) => {
  if (mongoose.connection.readyState != 1) {
    console.log("One" + mongoose.connection.readyState)
    return res.status(500).json({
      error: ' DB : connexion Error ',
      status: 'KO'
    })
  }
  Trips.find()
    .exec()
    .then(trips => {

      const response = {
        count: trips.length,
        trips: trips.map(t => ({
          ...(t.toJSON()),
          request: {
            type: 'GET',
            url: '' + process.env.BASE_URL + '/trip/' + t._doc._id
          }
        })
        )
      };
      console.log(JSON.stringify("Trips =>   count: " + trips.length));
      res.status(201).json(response)

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });

});

router.post('/', upload.array('tripsImage', 4), (req, res, next) => {
  //add file  url om trips here! 
  const { name,
    description,
    cityFrom,
    cityTo,
    departureDate,
    arrivaldate,
    kiloPrice,
    avalaiblekilos,
    tripsStatus,
  } = req.body;
  const trips = new Trips({
    _id: new mongoose.Types.ObjectId(),
    name,
    description,
    cityFrom,
    cityTo,
    departureDate,
    arrivaldate,
    kiloPrice,
    avalaiblekilos,
    tripsStatus,
    images: req.files.map(({ path, destination, filename }) => {
      return destination + filename;
    })
  });

  trips.save()
    .then((result) => {
      console.log("Saved", result);
    })
    .catch((err) => {
      console.log('SERVER: ' + err)
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
  const trips = Trips.findById(id)
    .exec()
    .then(trip => {
      if (trip == null) {
        return res.status(404).json({ error: 'No valid trips found' });
      }
      res.status(201).json({
        ...trip._doc, request: {
          type: 'GET',
          description: 'get all Trips ',
          url: '' + process.env.BASE_URL + '/trip/'
        }
      })

    })
    .catch(err => {
      console.log(err);

      res.status(500).json({ error: err });
    });
});

router.patch('/:tripId', (req, res, next) => {
  const id = req.params.tripId;
  const updateOps = {};
  for (const ops of Object.keys(req.body)) {
    updateOps[ops] = req.body[ops]
  }
  console.log("TRIPS " + id + " with update =>", updateOps);
  Trips.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(id, result)
      res.status(201).json({
        message: "Trip updated",
        request: {
          type: 'GET',
          url: '' + process.env.BASE_URL + '/trip/' + id
        },
        response: result
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete('/:tripId', checkAuth, (req, res, next) => {
  const id = req.params.tripId;
  Trips.deleteOne({ _id: id })
    .exec()
    .then(result => {
      console.log(result.deletedCount)
      var returnmessage = {
        message: result.deletedCount + " Trip Deleted"
      };
      if (result.deletedCount == 0) {
        returnmessage = {
          message: "No Trip Found! "
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