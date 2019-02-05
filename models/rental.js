const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

  const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 60
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 70
            }
        }),
        required: true
    },
    movies: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true, 
                minlength: 5,
                maxlength: 255
              },
              dailyRentalRate: { 
                type: Number, 
                required: true,
                min: 0,
                max: 255
              } 
        }), required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now()
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
    
  }));

  async function validateRental(rental) {
      try {
        const schema = {
            customerId: Joi.objectId().required(),
            movieId: Joi.objectId().require()
          };
        
          return Joi.validate(rental, schema);
          
      } catch (error) {
          console.log(new Error);
      }
    
  }

  exports.Rental = Rental;
  exports.validate = validateRental;
