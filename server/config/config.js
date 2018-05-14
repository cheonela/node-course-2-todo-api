// It is used to indicate which envirnoment (like Production, test, development)
// For Production, This variable is set on Heruko, don't have this set locally
// For test, we set the varialbe in the package.json file, for other, it will set to development
var env = process.env.NODE_ENV || 'development';
console.log(`Env **** ${env}`)


process.env.MONGODB_URI = 'mongodb://dbtest:lesson80@ds217360.mlab.com:17360/todoapp';
if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/NewTodoApp';
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/NewTodoAppTest';
}
