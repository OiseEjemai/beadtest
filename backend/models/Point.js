const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    points_balance: { type: Number, default: 0 },
});

module.exports = mongoose.model('Point', pointSchema);
