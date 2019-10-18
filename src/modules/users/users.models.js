

const mongoose = require('mongoose');

const { Schema } = mongoose;
const config = require('../../constants/config')


const collection = config.mongodb.collections

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  wallet_id: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  pin: {
      type: String,
      required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  phone_number: {
    type: Number,
    required: true
  },
  status: {
    type: Number,
  },
  account_balance: {
    type: Number,
    default: 0.00
  },
}, {
  timestamps: true,
});


const UserModel = mongoose.model(collection.users, userSchema);

module.exports = UserModel;

