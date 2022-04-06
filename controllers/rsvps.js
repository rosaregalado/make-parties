module.exports = (app, models) => {
  // NEW
  app.get('/events/:eventId/rsvps/new', (req, res) => {
    models.Event.findByPk(req.params.EventId).then(event => {
      res.render('rsvps-new', { event: event });
    });
  });

  // CREATE

  app.post('/rsvp', (req, res) => {
    models.Rsvp.create(req.body.EventId).then(rsvp => {
      res.redirect(`/events/${event_id}`);
    }).catch((err) => {
      console.log(err);
    });
  });

  app.delete('/rsvp/:id', (req, res) => {
    rsvp_id = req.params.id;
    models.Rsvp.findByPk(id=rsvp_id).then(rsvp => {
      rsvp.destroy();
      res.redirect(req.headers.referer);
    }).catch((err) => {
      console.log(err);
    });
  });
}
