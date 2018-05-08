var mongoose = require('mongoose');

// to tell mongoose to use promise rather than callback
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONOGODB_URI || 'mongodb://localhost:27017/NewTodoApp');

// We need to export the mongoose
module.exports = {mongoose}
