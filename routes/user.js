const express = require('express');
const router = express();
const mongoose = require('mongoose');
const User = require('../models/user');
const { json } = require('express');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const bcrypt = require('bcryptjs');
const user = require('../models/user');

router.post('/login', (req, res, next) => {
  User.find({ email: req.body.email })
  .exec()
  .then(users => { 
    if(users.length <1){
      return res.status(401).json({
        message: "Auth Failed"
      })
    }
    bcrypt.compare(req.body.password, users[0].password, (err, result) => {
      if(err){
        return res.status(401).json({
          message: "Auth Failed"
        });
      }
      if(result){
        const token = jwt.sign(
          { email:users[0].email, userId: users[0]._id},
          process.env.JWT_SECRET, 
          {expiresIn: "1h"}); 
          
        return res.status(200).json({
          message: "Auth succesful", 
          token : token 
        })
      }
      res.status(401).json({
        message: "Auth Failed"
      })
    })
  })
  .catch(
    err => {
      console.log(err); 
      res.status(500).json({
        error : err
      })
  });


});

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      console.log(user); 
      if (user.length>0) {
        res.status(409).json({
          message: "Mail Exists"
        })
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              name: req.body.name,
              firstName: req.body.firstName,
              city: req.body.city,
              password: hash,
            });
            console.log(JSON.stringify(user));
            user
              .save()
              .then(result => {
                res.status(201).json({
                  message: "handling post request to /user/signup",
                  createdUser: user
                })
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                })
              });
          }
        });
      }
    })

});

router.get("/:userId", (req, res) => {
  const id = req.params.userId;
  User.findById(id)
    .exec()
    .then(user => {
      console.log(user)
      if (user == null) {
        return res.status(404).json({ error: 'No valid user found' });
      }
      const { _id, email, name, firstName, city } = user;
      const response = {
        _id,
        email,
        name,
        firstName,
        city,
        request: {
          type: 'GET',
          description: 'get all users ',
          url: '' + process.env.BASE_URL + 'user/'
        }
      }

      res.status(201).json(response)

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });

});

router.patch("/:userId", (req, res) => {
  const id = req.params.userId;
  const updateOps = {};
  for (const ops of Object.keys(req.body)) {
    updateOps[ops] = req.body[ops]
  }

  var extract
  if (updateOps.password) {
    try {
      updateOps.password = bcrypt.hashSync(updateOps.password, 10)
    } catch (error) {
      delete user.password;
    }

  }

  console.log("END =>", updateOps);



  User.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(id, result)
      res.status(201).json({
        message: "user updated",
        request: {
          type: 'GET',
          url: '' + process.env.BASE_URL + 'user/'
        },
        response: result
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
})

router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.deleteOne({ _id: id })
    .exec()
    .then(result => {
      console.log(result)
      var returnmessage = {
        message : "User Deleted" 
      };
      if(result.deletedCount==0){
        returnmessage={
          message : "No User Found! " 
        };  
      }
      res.status(200).json(returnmessage) 
    })

    
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    })
});

router.get("/", (req, res) => {


  User.find().select("-password")
    .exec()
    .then(users => {
      const response = {
        count: users.length,
        users: users.map(({ _id, email, name, firstName, city }) => ({
          _id,
          email,
          name,
          firstName,
          city,
          request: {
            type: 'GET',
            url: '' + process.env.BASE_URL + 'user/' + _id
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

module.exports = router; 
