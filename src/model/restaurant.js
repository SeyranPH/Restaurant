const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
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
      required: false,
    },
    location: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      default: '3',
    },
    reviews: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Review',
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;
