const express = require('express');
const router = express();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const checkRole = require('../middleware/check-role');
const { Trips, Reservation } = require('../models/trips');
const User = require('../models/user');

const upload = require('../middleware/multerHelper');
const path = require('path')

router.get('/', checkRole, (req, res, next) => {
  let reservations = [];

  Trips.find()
    .populate('reservations')
    .exec()
    .then(trips => {
      trips.map(element => {
        reservations = reservations.concat(element._doc.reservations)
      })
      res.status(200).json({
        'status': 'ok',
        'count': reservations.length,
        'result': reservations
      })
    }).catch(err => {
      console.log('SERVER: ' + err)
      res.status(401).json({
        message: "ANY  Reservation found!\n" + err
      })
    });
});


/**
 * Post New Reservation and ad ID in   trip finded by tripId.
 * @param  {} route
 * @param  {} upload
 * @param  {} checkAuth

 * @param  Int kilosReserved
 * @param  String date_Res
 * @param  String name
 * @param  String firstName

 * @param  String kilosReserved
 * @param  Date date_Res
 * @param  String firstName
 * @param  Int user

 */
router.post('/', upload.any(), checkAuth, (req, res, next) => {
  //add file  url om trips here! 

  const { tripId, kilosReserved, date_Res, name, firstName, user } = req.body;

  console.log({ tripId, kilosReserved, date_Res, name, firstName, user });
  var t = null;
  if (!user)
    return res.status(404).json({ error: 'No valid USER found with ' + tripId });

  User.findById({ _id: user }).exec()
    .then(bdUser => {
      if (bdUser == null) {
        return res.status(404).json({ error: 'No valid USER found In DB  with ' + tripId });
      }
      return Trips.findById(tripId)
        .exec()
    }).then(trip => {
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
      if (result.error)
        return result;

      console.log(" Reservation Saved ", result);
      console.log(' t.reservation =>' + t.reservations)
      Trips.updateOne({ _id: tripId }, { $set: { reservations: [...t.reservations, result.toJSON()._id] } })
        .exec().then(result => {
          console.log(tripId, result._doc)
          res.status(201).json({
            message: "Trip updated updated with reservation",
            request: {
              type: 'GET',
              url: '' + process.env.BASE_URL + 'Trip/' + tripId
            },
            nModified: result.nModified
          })
        })
    }).catch((err) => {
      console.log('SERVER: ' + err)
      res.status(401).json({
        message: "Can't Create Reservation \n" + err
      })
    })
});

router.get('/:resercationId', (req, res, next) => {
  const id = req.params.resercationId;
  Reservation.findById(id)
    .exec()
    .then(reservation => {
      if (reservation == null) {
        return res.status(404).json({ error: 'No valid trips found' });
      }
      res.status(201).json({
        ...reservation._doc, request: {
          type: 'GET',
          description: 'get all reservation ',
          url: '' + process.env.BASE_URL + 'reservation/'
        }
      })

    })
    .catch(err => {
      console.log(err);

      res.status(500).json({ error: err });
    });
});

router.patch('/addkilo/:tripId', upload.any(), (req, res, next) => {
  const id = req.params.tripId;
  const { kilosReserved, kiloReservedPrice } = req.body
  const updateOps = {};

  console.log("TRIPS " + id + 'kilosReserved ' + kilosReserved);
  Reservation.findById({ _id: id })

    .exec()
    .then(result => {
      console.log(id + " \n", result._doc)

      updateOps.priceTotal = result.priceTotal + (+kiloReservedPrice) * kilosReserved
      updateOps.kilosReserved = result._doc.kilosReserved + (+kilosReserved)
      console.log("updateOps " + JSON.stringify(updateOps));
      return Reservation.updateOne({ _id: id }, { $set: updateOps }).exec()
    })
    .then(result => {
      res.status(201).json({
        message: "Res updated",
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

router.delete('/:tripId/:reservationId', checkAuth, (req, res, next) => {
  const tripId = req.params.tripId;
  const reservationId = req.params.reservationId;
  var reservations;
  if (!tripId)
    return res.status(404).json({ error: 'Null Handle' + tripId });
  Trips.findById(tripId)
    .exec()
    .then(trip => {

      console.log('trip selected \n ', trip, ' reservationId ' + reservationId)
      if (trip == null) {
        res.status(404).json({ error: 'No valid trips found with ' + tripId });
        return { status: 'ERROR', error: 'No valid trips found with ' + tripId };
      }
      reservations = trip.toJSON().reservations.filter(element => (element != reservationId));

      console.log('reservations after altered  \n ', reservations)
      return Trips.updateOne({ _id: tripId }, { $set: { reservations } })
        .exec()
    })
    .then(result => {
      if (result.status === 'ERROR')
        return result;

      console.log('remove Reservation on Trip \n')
      return Reservation.deleteOne({ _id: reservationId }).exec()
    }).then((result) => {

      if (result.status === 'ERROR')
        return result;
      if (result.deletedCount == 0) {
        res.status(200).json({
          message: "No Reservation Found! "
        })
      }

      res.status(200).json({
        status: 'OK',
        message: 'Reservation deleted',
        count: result.deletedCount
      })

    }).catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    })
});



module.exports = router; 