// jsonwebtoken 
const jwt = require('jsonwebtoken');

function generateJWT(user) {
  const mpJWT = jwt.sign({ id: user.id }, "AUTH-SECRET", { expiresIn: 60*60*24*60 });
  return mpJWT
}

// authentication routes
module.exports = function (app, models) {
  // sign up
  app.get('/sign-up', (req, res) => {
    res.render('sign-up')
  });

  // create account
  app.post('/sign-up', (req, res) => {
    models.User.create(req.body).then((user) => {
      // create token
      const mpJWT = generateJWT(user);
      res.cookie('mpJWT', mpJWT);
      req.session.sessionFlash = {
        type: 'success',
        message: 'You have successfully created an account!',
      };
      res.redirect('/'); 
    })
    .catch((err) => {
      console.log(err);
    });
  });

  // login
  app.get('/login', (req, res) => {
    res.render('login')
  });

  app.post('/login', (req, res, next) => {
    // look up user with email
    models.User.findOne({ where: { email: req.body.email } }).then((user) => {
      // compare passwords
      user.comparePassword(req.body.password, function(err, isMatch) {
        // if not match, send back to login
        console.log("login pw:", req.body.password)
        if (!isMatch) {
          console.log('mismatch!!!');
          req.session.sessionFlash = { type: 'danger', message: 'Incorrect email or password.' }
          return res.redirect('/login');
        }
        // if it is match, generate JWT
        const mpJWT = generateJWT(user);
        // save jwt as cookie
        res.cookie("mpJWT", mpJWT);
        req.session.sessionFlash = { type: 'success', message: 'Successfully logged in!' }
        res.redirect('/');
      })
    }).catch((err) => {
      // if can't find user, return to login
      console.log("LOGIN ERRORR", err)
      req.session.sessionFlash = { type: 'danger', message: 'Wrong email or password.' }
      return res.redirect('/login');
    });
  });

  // logout
  app.get('/logout', (req, res, next) => {
    res.clearCookie('mpJWT');
  
    req.session.sessionFlash = { type: 'success', message: 'Successfully logged out.' }
    // comment the above line in once you have error messaging setup (step 15 below)
    return res.redirect('/');
  });
}