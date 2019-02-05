const {Rental, validate} = require('../models/rental'); 
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);


router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
  });

  
  router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) res.status(400).send('Invalid customer');

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) res.status(400).send('Invalid Movie');

    if (movie.numberInStock === 0) {
         res.status(400).send('Movie is not in stock')
     }
  
  
    let rental = new Rental({ 
      customer: {
          _id: customer._id,
          name: customer.name,
          phone: customer.phone
      },
      movie: {
          _id: movie._id,
          title: movie.title,
          dailRentalRate: movie.dailRentalRate
      }
    });
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: movie._id }, {
                $inc: {numberInStock: -1}
    })
    .run();
    } catch (error) {
        res.status(500).send('Something went wrong, Tyr again');
    }
    

    res.send(rental);
  });

  module.exports = router;