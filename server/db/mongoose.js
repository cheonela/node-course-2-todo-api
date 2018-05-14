var mongoose = require('mongoose');

// to tell mongoose to use promise rather than callback
mongoose.Promise = global.Promise;

// Check if having the server for mongodb, if not, then use local host
let db = {
  localhost: 'mongodb://localhost:27017/NewTodoApp',
  mlab: 'mongodb://dbtest:lesson80@ds217360.mlab.com:17360/todoapp'
}
mongoose.connect(db.mlab || db.localhost);
//mongoose.connect(db.localhost);

// We need to export the mongoose
module.exports = {mongoose}
