const express = require('express');
const router = express();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const { Trips, Reservation } = require('../models/trips');

const upload = require('../middleware/multerHelper');
const path = require('path')



router.get('/', (req, res, next) => {
  res.status(201).json({
    'status': 'ERROR',
    'message': ' add tripID and userId to find Reservation'
  })
});

//Post New Reservation and ad ID in   trip finded by tripId. 
router.post('/', upload.any(), (req, res, next) => {
  //add file  url om trips here! 

  const { tripId, kilosReserved, date_Res, name, firstName } = req.body;
  console.log(req.body)

  console.log({

    tripId, kilosReserved, date_Res, name, firstName
  });
  var t = null;
  Trips.findById(tripId)
    .exec()
    .then(trip => {
      if (trip == null) {
        return res.status(404).json({ error: 'No valid trips found with ' + tripId });
      }
      t = trip.toJSON();
      console.log({
        tripId, kilosReserved, date_Res, name, firstName,
        priceTotal: kilosReserved * t.kiloPrice
      });

      const reservation = new Reservation({
        _id: new mongoose.Types.ObjectId(),
        firstName,
        name,
        kiloReservedPrice: t.kiloPrice,
        kilosReserved,
        date_Res,
        priceTotal: kilosReserved * t.kiloPrice
      })
      return reservation.save()
    }).then((result) => {
      console.log(" Reservation Saved ", result);
      console.log(' t.reservation =>' + t.reservations)
      Trips.updateOne({ _id: tripId }, { $set: { reservations: [...t.reservations, result.toJSON()._id] } })
        .exec().then(result => {
          console.log(tripId, result)
          res.status(201).json({
            message: "Trip updated updated with reservation",
            request: {
              type: 'GET',
              url: '' + process.env.BASE_URL + 'Trip/' + tripId
            },
            response: result
          })
        })
    }).catch((err) => {
      console.log('SERVER: ' + err)
      res.status(401).json({
        message: "Can't Create Reservation \n" + err
      })
    })
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
          url: '' + process.env.BASE_URL + 'trips/'
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