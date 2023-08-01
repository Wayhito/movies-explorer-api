const mongoose = require('mongoose');

const validator = require('validator');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      default: 'Гладких Илья',
    },
  },

  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userSchema);
