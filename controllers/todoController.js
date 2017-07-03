var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//Connect to the database
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

//Create schema - like a blueprint for data
var todoSchema = new mongoose.Schema({
  item: String
});

var Todo = mongoose.model('Todo', todoSchema);
// var itemOne = Todo({item: 'learn piano'}).save(function(err) {
//   if (err) throw err;
//   console.log('item saved');
// })

//var data = [{item: 'play game'}, {item: 'get milk'}, {item: 'walk dog'}];
var urlEncodedParser = bodyParser.urlencoded({extended: false}); //extended:false value is string and array only

module.exports = function(app) {
  //set routes
  app.get('/todo', function(req, res) {
    //retrieve the collection from mongoDB
    Todo.find({}, function(err, data) {
      if (err) throw err;
      res.render('todo', {todos: data});
    })
  });

  app.post('/todo', urlEncodedParser, function(req, res) {
    //add the item to Todo collections
    var newTodo = Todo(req.body).save(function(err, data) {
      if (err) throw err;
      res.json(data);
    });
  });

  app.delete('/todo/:item', urlEncodedParser, function(req, res) {
    //delete the requested item from mongodb
    //replace the '-' from :item with ' '
    Todo.find({item: req.params.item.replace(/\-/g, ' ')}).remove(function(err, data) {
      if (err) throw err;
      res.json(data);
    })
  });

  app.use(function(req, res){
       res.send(404);
   });
};