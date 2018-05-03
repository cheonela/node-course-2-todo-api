const expect = require('expect');     // for assertions
const request = require('supertest'); // to test our express routes

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  text: 'First test todo'
}, {
  text: 'Second test todo'
}];

// we need to have this, before the testing start, it is a testing lifecycle method
// the code will be run before every single test
// for this case, we need to make sure the db is empty, because the below checking assume there is no data in the db
// beforeEach((done) => {
//   Todo.remove({}).then(() => {
//     return Todo.insertMany(todos); // in order to test the get, we insert some dummy records
//   }).then(() => done());
// });

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
          expect(todos.length).toBe(3);
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
      expect(res.body.todos.length).toBe(3);
    })
    .end(done);
  });

});
