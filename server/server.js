// This config file contains how to setup the envoriment
require('./config/config.js');

//library imports
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');  // send the json to the server
const {ObjectID} = require('mongodb');


//local imports - get the variable
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;


// need to have the middleware
app.use(bodyParser.json());


// configuring the routes (post route), when we doing the db update, we will use the post HTTP method, and send the Json
// object to the server, then create the new model, and send the complete model with ID, and back to client
// app.post passing 2 arguments, 1st URL, 2nd: call back function, and the callback has 2 arguments, request, response
app.post('/todos', (req, res) => {
  console.log(req.body);  // the body store in the bodyParser

  // create the instance mongoose model
  var todo = new Todo({
    text: req.body.text

  });

  // it is save to the db
  todo.save().then((doc) => {
    // then we will send the doc callback
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);    // also can send back the status
  });

});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// Get /todos passing the ID from URL
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;   // this is get the parameters from the URL, it has the field name, and value


  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo}); // send back the todo object
  }).catch((e) => {
    res.status(400).send();
  })
});

// To delete a record
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;   // this is get the parameters from the URL, it has the field name, and value


  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo}); // send back the todo object
  }).catch((e) => {
    res.status(400).send();
  })

});


// Update
app.patch('/todos/:id', (req, res) =>{
  var id = req.params.id;

  // now get the body that we want to update. We use the pick method will get the properties that allow to update,
  // in this example, we only allow the user to change the text, and completd flag, the completed at will only
  // allow to update by the program
  // so if text property exists, then it will pull off to body
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {

    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  // new: is return the updated object
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo}); // send back the todo object
  }).catch((e) => {
    res.status(400).send();
  })


});

// POST /users
// this will be a public route, so the people can signin, however, the other routes will be private. Only
// can access if signon successfully
app.post('/users', (req, res) => {
  console.log(req.body);  // the body store in the bodyParser

  // Only take the email, and password, as the token is not allow the user to maintain
  var body = _.pick(req.body, ['email', 'password']);

  // create the instance mongoose model
  var user = new User(body);

  // it is save to the db
  user.save().then(() => {
    // then we will send the doc callback
    // We use this method to save the user
    return user.generateAuthToken();
  }).then((token) => {
    // we need to send back the header for the HTTP response header
    // header takes 2 arguements: one is the header name, and value for the header name
    // if starts with x-, it is a custom header
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});



// this is just a simple private page to show the user information after successfully signon
// we reference the middleware
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});




// It is used to bind the applicatiion to the port
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});


module.exports = {app};
