const express = require('express');

const exphbs = require('express-handlebars');

const methodOverride = require('method-override');

const serveStatic = require('serve-static');

const flash = require('connect-flash');

const session = require('express-session');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const app = express();

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Map global promise to remove deprecation warning
mongoose.Promise = global.Promise;
//connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
  useMongoClient: true
})
  .then(() =>{console.log('MongoDB Connected')})
  .catch(err => {console.log(err)});



// Variable for serveStatic middleware
const newLocal = 'c:/projects/vidjot/public';

// serveStatic middleware
app.use(serveStatic(newLocal));

// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Methodoverride middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

// Flash middleware
app.use(flash());


// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Middleware practice
// app.use(function(req, res, next){
//   console.log(Date.now());
//   next();
// });


// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) =>{
  res.render('about');
});




// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000; 

app.listen(port, ()=>{
  console.log(`Server started on port ${port}`);
});
