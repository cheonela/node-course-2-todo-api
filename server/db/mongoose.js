var mongoose = require('mongoose');

// to tell mongoose to use promise rather than callback
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI);

// We need to export the mongoose
module.exports = {mongoose}
