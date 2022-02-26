const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    creatorUid: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    dateOfCreation: {
      type: Number,
      required: true,
    },
    dateTimestamp: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
