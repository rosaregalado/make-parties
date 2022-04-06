const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const methodOverride = require('method-override');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const bodyParser = require('body-parser');
const models = require('./db/models');
require('./controllers/events')(app, models);
require('./controllers/rsvps')(app, models);

// use "main" as our default layout
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
// use handlebars to render html pages
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true }));
// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))

const path = require('path');
module.exports = {
  "config": path.resolve('./db/config', 'config.json'),
  "models-path": path.resolve('./db/models'),
  "seeders-path": path.resolve('./db/seeders'),
  "migrations-path": path.resolve('./db/migrations')
};

// Index
app.get('/', (req, res) => {
  models.Event.findAll({ order: [['createdAt', 'DESC']] }).then(events => {
    res.render('events-index', { events: events });
  })
})

// new event
app.get('/events/new', (req, res) => {
  res.render('events-new', {});
});

// create event
app.post('/events', (req, res) => {
  models.Event.create(req.body).then(event => {
    res.redirect(`/events/${event.id}`);
  }).catch((err) => {
    console.log(err);
  });
})

// show event
app.get('/events/:id', (req, res) => {
  // Search for the event by its id that was passed in via req.params
  models.Event.findByPk(req.params.id).then((event) => {
    // If the id is for a valid event, show it
    res.render('events-show', { event: event })
  }).catch((err) => {
    // if the id was for an event not in our db, log an error
    console.log(err.message);
  })
})

// edit event
app.get('/events/:id/edit', (req, res) => {
  event_id = req.params.id
  models.Event.findByPk(id=event_id).then(event => {
    res.render('events-edit', {event: event})
  })
});

// update event
app.put('/events/:id', (req, res) => {
  models.Event.findByPk(req.params.id).then(event => {
    event.update(req.body).then(event => {
      res.redirect(`/events/${req.params.id}`);
    }).catch((err) => {
      console.log(err);
    });
  }).catch((err) => {
    console.log(err);
  });
});

// delete event
app.delete('/events/:id', (req, res) => {
  event_id = req.params.id;
  models.Event.findByPk(req.params.id).then(event => {
    event.destroy();
    res.redirect(`/`);
  }).catch((err) => {
    console.log(err);
  });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('App listening on port 3000!')
});

