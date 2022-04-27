const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const methodOverride = require('method-override');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session');
const models = require('./db/models');


// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'));
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
// use handlebars to render html pages
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('secret'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false
}));
app.use(flash());

// detect if someone is logged in
app.use(function authenticateToken(req, res, next) {
  // Gather the jwt access token from the cookie
  const token = req.cookies.mpJWT;

  if (token) {
    jwt.verify(token, "AUTH-SECRET", (err, user) => {
      if (err) {
        console.log(err)
        // redirect to login if not logged in and trying to access a protected route
        res.redirect('/login')
      }
      req.user = user
      next(); // pass the execution off to whatever request the client intended
    })
  } else {
    next();
  }
});

// create a currentUser obj
app.use((req, res, next) => {
  if (req.user) {
    models.User.findByPk(req.user.id)
      .then((currentUser) => {
        res.locals.currentUser = currentUser;
        next();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    next();
  }
});


require('./controllers/events')(app, models);
require('./controllers/rsvps')(app, models);
require('./controllers/auth')(app, models);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('App listening on port 3000!')
});

