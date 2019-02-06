const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const _ = require('lodash')
const bcyrpt = require('bcrypt');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/me', auth, asyncMiddleware(async(req, res) => {
   const user = await User.findById(req.user._id).select('-password');
   res.send(user);
}));

router.post('/', asyncMiddleware(async(req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('user alredy registered');

    user =  new User(
        _.pick(req.body, ['name', 'email', 'password'])
    );
    const salt = await bcyrpt.genSalt(6);
    user.password = await bcyrpt.hash(user.password, salt);
    user = await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
}));


module.exports = router;