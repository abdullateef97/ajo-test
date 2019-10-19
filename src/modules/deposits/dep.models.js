

const mongoose = require('mongoose');

const { Schema } = mongoose;
const config = require('../../constants/config')


const collection = config.mongodb.collections

const depsSchema = new Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: collection.users,
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


const DepsModel = mongoose.model(collection.deposits, depsSchema);

module.exports = DepsModel;

