const express = require('express');
const router = express();
const mongoose = require('mongoose'); 
const User = require('../models/user'); 
const { json } = require('express');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res , next ) => {
    console.log("----------"); 
    console.log(JSON.stringify(req.body.password)); 
    bcrypt.hash(req.body.password , 10 , (err , hash) => {

        if(err){
            return res.status(500).json({
                error : err 
            });
        }else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email, 
                name: req.body.name, 
                firstName: req.body.firstName, 
                city: req.body.city, 
                password:hash,
            });
            console.log(JSON.stringify(user)); 
            user
            .save()
            .then(result => { 
                res.status(201).json({
                    message: 'User created'   
                })
            })
            .catch(err => {
                console.log(err); 
                res.status(500).json({
                    error : err 
                })   
            }); 
            res.status(201).json({
                message : "handling post request to /user/signup", 
                createdUser: user 
            })
        }
    });
});
router.get('/test', (req, res) => {
    res.send('test O is start ');
});
module.exports = router; 
