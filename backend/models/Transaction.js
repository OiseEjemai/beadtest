// models/Transaction.js

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  provider: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  planId: { type: String, required: false },
  points_earned: Number,
  points_redeemed: Number,
  amount: { type: Number, required: true },
  success: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
