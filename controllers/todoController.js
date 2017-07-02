var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//Connect to the database
mongoose.connect(process.env.DATABASE);

//Create schema - like a blueprint for data
var todoSchema = new mongoose.Schema({
  item: String
});

var Todo = mongoose.model('Todo', todoSchema);
var itemOne = Todo({item: 'learn piano'}).save(function(err) {
  if (err) throw err;
  console.log('item saved');
})

var data = [{item: 'play game'}, {item: 'get milk'}, {item: 'walk dog'}];
var urlEncodedParser = bodyParser.urlencoded({extended: false}); //extended:false value is string and array only

module.exports = function(app) {
  //set routes
  app.get('/todo', function(req, res) {
    res.render('todo', {todos: data});
  });
  app.post('/todo', urlEncodedParser, function(req, res) {
    //push the added item to data[]
    data.push(req.body);
    res.json(data);
  });
  app.delete('/todo/:item', urlEncodedParser, function(req, res) {
    data = data.filter(function(todo) {
      return todo.item.replace(/ /g, '-') !== req.params.item;
    })
    res.json(data);
  });
};