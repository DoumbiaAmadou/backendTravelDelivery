const express = require('express');
const router = express();
const mongoose = require('mongoose'); 
const User = require('../models/user'); 
const { json } = require('express');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res , next ) => {
    console.log("----------"); 
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
                    message : "handling post request to /user/signup", 
                    createdUser: user
                })
            })
            .catch(err => {
                console.log(err); 
                res.status(500).json({
                    error : err 
                })
            });
        }
    });
});
router.get("/:userId", (req, res) => {
    const id = req.params.userId ; 
    User.findById(id)
    .exec()
    .then(user => {
        console.log(user)
        if(user!= null){
            delete user.password ; 
           res.status(201).json(user)
        }else{
            res.status(404).json({error : 'No valid user found'}); 
        }
    })
    .catch(err => {
        console.log(err) ; 
        res.status(500).json({error: err}); 
    }); 

});
router.patch("/:userId", (req, res) => {
    const id = req.params.userId;
    const updateOps  = {}; 
    for(const ops of Object.keys(req.body)){
        updateOps[ops] = req.body[ops] 
    }
    console.log(updateOps)
    User.updateOne({ _id: id }, { $set: updateOps} )
        .exec()
        .then(result => {
            console.log(id,result)
            res.status(201).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

});
router.delete("/:userId", (req, res , next) => {
    const id = req.params.userId;
    User.deleteOne({_id : id})
    .exec()
    .then(result =>{
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err) ; 
        res.status(500).json({
            error : err
        });
    })
});
router.get("/", (req, res) => {
    const id = req.params.userId;
    User.find()
        .exec()
        .then(users => {
        
            //no entries is not necessarily a error  
            // if(users.length>=0){
            // console.log(users)
            res.status(201).json(users)
            // }else{
            //     res.status(200).json({
            //          message : 'No Entries found'
            //     })
            // }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

});
module.exports = router; 
