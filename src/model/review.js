const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    restaurant: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    reply: {
      comment: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        required: true,
      },
      updatedAt: {
        type: Date,
        required: true,
      },
    },
  },
  { timestamps: true, versionKey: false }
);

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
