const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    emailConfirmed: {
      type: Boolean,
      required: true,
    },
    emailConfirmationToken: {
      tyoe: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
