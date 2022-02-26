const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema(
  {
    creatorUid: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;
