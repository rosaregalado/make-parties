module.exports = (app, models) => {
  // new
  app.get('/events/:eventId/rsvps/new', (req, res) => {
    models.Event.findByPk(req.params.EventId).then(event => {
      res.render('rsvps-new', { event: event });
    });
  });

  // create
  app.post('/rsvp', (req, res) => {
    models.Rsvp.create(req.body.EventId).then(rsvp => {
      res.redirect(`/events/${event_id}`);
    }).catch((err) => {
      console.log(err);
    });
  });

  // delete 
  app.delete('/events/:eventId/rsvps/:id', (req, res) => {
    models.Rsvp.findByPk(req.params.id).then(rsvp => {
      rsvp.destroy();
      res.redirect(`/events/${req.params.eventId}`);
    }).catch((err) => {
      console.log(err);
    });
  }); 
}
