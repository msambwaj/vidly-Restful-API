const asyncMiddleware = require('../middleware/async');
const _ = require('lodash')
const Joi  = require('joi');
const bcyrpt = require('bcrypt');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', asyncMiddleware(async(req, res) => {
    const users = await User.find()
    res.send(users);
}));

router.post('/', asyncMiddleware(async(req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('invalid email or password');

    const validPassword = await bcyrpt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('invalid password');

    const token = user.generateAuthToken()
    res.send(token);
}));

async function validate(req) {
    const schema = {
      email: Joi.string().required().max(255).min(5).email(),
      password: Joi.string().min(6).max(25).required(),
    };
  
    return Joi.validate(user, schema);
  }

module.exports = router;