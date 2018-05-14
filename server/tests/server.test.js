const expect = require('expect');     // for assertions
const request = require('supertest'); // to test our express routes
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

// we need to have this, before the testing start, it is a testing lifecycle method
// the code will be run before every single test
// for this case, we need to make sure the db is empty, because the below checking assume there is no data in the db
beforeEach((done) => {
  Todo.remove({}).then(() => {
    // in order to test the get, we insert some dummy records
   return Todo.insertMany(todos, (error, docs) => {
       if(error){
           return done(error);
       }
   });
   }).then(() => done());
});

// use describe to group all the routes
describe('POST /todos', () => {
  it('should create a new todo', (done) =>{
    var text = 'Cooking';

    // making request using supertest
    request(app)
      .post('/todos')     // to post a request
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
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
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
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);  // check the text if match
    })
    .end(done);
  });


  // check if valid  ID
  it('should get 404 using invalid ID', (done) => {
    var id = "5aeb0cd4cf6bbe2ad0620a2";
    request(app)
    // trying to use ID the 1st element in the array, as ID is an object, we need to convert this to
    // string in order to put in the URL string
    .get(`/todos/${id}`)
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
    .expect(404)
    .end(done);

  });
});



describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
      var hexid = todos[1]._id.toHexString();

      request(app)
      .delete(`/todos/${hexid}`)
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

  it('should return 404 if todo not found', (done) => {
    var hexid = new ObjectID().toHexString();

    request(app)
    .delete(`/todos/${hexid}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 if Object ID not valid', (done) => {
    var id = "5aeb0cd4cf6bbe2ad0620a2";

    request(app)
    .delete(`/todos/${id}`)
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

  it('should clear the 2nd todo', (done) => {
    var hexid = todos[1]._id.toHexString();
    var text = 'Test case 2';


    request(app)
    .patch(`/todos/${hexid}`)
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
