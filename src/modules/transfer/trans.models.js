

const mongoose = require('mongoose');

const { Schema } = mongoose;
const config = require('../../constants/config')


const collection = config.mongodb.collections

const transSchema = new Schema({

  sender_id: {
    type: String,
    required: true
  },
  sender_wallet_id: {
    type: String,
    required: true
  },
  recipient_id: {
    type: String,
    required: true
  },
  recipient_wallet_id: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    default: config.status.PENDING
  },
}, {
  timestamps: true,
});


const TransModel = mongoose.model(collection.transfers, transSchema);

module.exports = TransModel;

