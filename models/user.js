const mongoose = require('mongoose');
const Joi = require('joi');

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    }

}));

function validateUser(user) {
    const schema = {
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().required().max(255).min(5).email(),
      password: Joi.string().min(6).max(25).required(),
    };
  
    return Joi.validate(user, schema);
  }


  exports.User = User;
  exports.validate = validateUser