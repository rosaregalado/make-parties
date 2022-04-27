module.exports = function (app, models) {
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
    models.Event.findByPk(req.params.id).then(event => {
        res.render('events-show', { event: event });
    }).catch((err) => {
        console.log(err.message);
    })
  });

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
}