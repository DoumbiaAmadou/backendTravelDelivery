const express = require('express');
const router = express();
const mongoose = require('mongoose');
const User = require('../models/user');
const { json } = require('express');
const bcrypt = require('bcrypt');
const user = require('../models/user');

router.post('/signup', (req, res, next) => {

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
    if (updateOps.password){
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
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});
router.get("/", (req, res) => {
    const id = req.params.userId;
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
                    password,
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
