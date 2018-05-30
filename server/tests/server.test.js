const expect = require('expect');     // for assertions
const request = require('supertest'); // to test our express routes
const {ObjectID} = require('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);

// we need to have this, before the testing start, it is a testing lifecycle method
// the code will be run before every single test
// for this case, we need to make sure the db is empty, because the below checking assume there is no data in the db
beforeEach(populateTodos);

// use describe to group all the routes
describe('POST /todos', () => {
  it('should create a new todo', (done) =>{
    var text = 'Walking';

    // making request using supertest
    request(app)
      .post('/todos')     // to post a request
      .set('x-auth', users[0].tokens[0].token)
      .send({text})     // to send data, pass in object and will convert to JSON by supertest
      .expect(200)      // now making assertions about the request, we expect the status will be 200, also
      // make an assertions about the body thats comes back. We need to make sure the body is an
      // object, and has text property
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      // error: if status <> 200, the text not match with what we sent
      .end ((err, res) => {
        if (err) {
          return done(err);  // it will stop this function running, so it will not run the coding below
        }

        // now fetch the db, and see if this entry has been added, check if the text matched with what we tested
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
          }).catch((e) => done(e));     // if these 2 check failed, then pass to done
      });
  });

  it('should not create todo with invalid body data', (done) =>{

    // making request using supertest
    request(app)
      .post('/todos')     // to post a request
      .set('x-auth', users[0].tokens[0].token)
      .send({})     // to send data, pass in object and will convert to JSON by supertest
      .expect(400)      // now making assertions about the request, we expect the status will be 200, also
      .end ((err, res) => {
        if (err) {
          return done(err);  // it will stop this function running, so it will not run the coding below
        }

        // now fetch the db, and see if this enry has been added
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));     // if these 2 check failed, then pass to done
      });
  });
});


describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(1);
    })
    .end(done);
  });

});


describe('GET /todos/:id', () => {
  it('should get todos using correct ID', (done) => {

    request(app)
    // trying to use ID the 1st element in the array, as ID is an object, we need to convert this to
    // string in order to put in the URL string
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);  // check the text if match
    })
    .end(done);
  });


  it('should not get todos created by other user', (done) => {

    request(app)
    // trying to use ID the 1st element in the array, as ID is an object, we need to convert this to
    // string in order to put in the URL string
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });


  // check if valid  ID
  it('should get 404 using invalid ID', (done) => {
    var id = "5aeb0cd4cf6bbe2ad0620a2";
    request(app)
    // trying to use ID the 1st element in the array, as ID is an object, we need to convert this to
    // string in order to put in the URL string
    .get(`/todos/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);

  });

  // check if ID not found
  it('should get 404 using ID not found', (done) => {
    var hexid = new ObjectID().toHexString();

    request(app)
    // trying to use ID the 1st element in the array, as ID is an object, we need to convert this to
    // string in order to put in the URL string
  //  .get(`/todos/${todos[0]._id.toHexString()}`)
    .get(`/todos/${hexid}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);

  });
});



describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
      var hexid = todos[1]._id.toHexString();

      request(app)
      .delete(`/todos/${hexid}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexid);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        // to check if this id still exists in the db
        Todo.findById(hexid).then((todo) => {
          expect(todo). toBeFalsy();
          done();
        }).catch((e) => done(e));
      });

  });

  it('should not remove a todo created by other user', (done) => {
      var hexid = todos[0]._id.toHexString();

      request(app)
      .delete(`/todos/${hexid}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        // to check if this id still exists in the db, should not delete
        Todo.findById(hexid).then((todo) => {
          expect(todo). toBeTruthy();
          done();
        }).catch((e) => done(e));
      });

  });

  it('should return 404 if todo not found', (done) => {
    var hexid = new ObjectID().toHexString();

    request(app)
    .delete(`/todos/${hexid}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 if Object ID not valid', (done) => {
    var id = "5aeb0cd4cf6bbe2ad0620a2";

    request(app)
    .delete(`/todos/${id}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });

});


describe('PATCH /todos/:id', () => {
  it('should update a todo', (done) => {
      var hexid = todos[0]._id.toHexString();
      var text = 'Test case 1';


      request(app)
      .patch(`/todos/${hexid}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })

      .end((err, res) => {
        if (err) {
          return done(err);
        }
      done();
      });

  });

  it('should not update a todo for other creator', (done) => {
      var hexid = todos[0]._id.toHexString();
      var text = 'Test case 1';


      request(app)
      .patch(`/todos/${hexid}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(404)
      .end(done);
      });

  });

  it('should clear the 2nd todo', (done) => {
    var hexid = todos[1]._id.toHexString();
    var text = 'Test case 2';


    request(app)
    .patch(`/todos/${hexid}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({
      completed: false,
      text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBeFalsy();
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
    done();
    });
  });
});


describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      // we need to set the header, using supertest
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if no authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {

    var email = 'ttt@hotmail.com';
    var password = '123456!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      // we expect the x-auth token return back
      // in order to get the value from header, we need to use the bracket notation, because the headername
      // has a hyphen, it would be invalid using dot notation
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        // Password should not be same, as password has hashed.
        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation error if request invalid', (done) => {
    var email = 'tdthotmail.com';
    var password = '123!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {

    var password = '123456!';

    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password})
      .expect(400)
      .end(done);
  });
})


describe('POST /users/login', () => {
  it('should login and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        // then check if the token has been added to the token array
        User.findById(users[1]._id).then((user) => {
          expect(user.toObject().tokens[1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        // then check if the token has been added to the token array
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      User.findById(users[0]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e) => done(e));
    });
  });
});
