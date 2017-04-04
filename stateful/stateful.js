'use strict';

// LIBRARIES

const express         = require('express');
const app             = express();
const server          = require('http').Server(app);
const session         = require('express-session');

// EXPRESS SESSION SET UP

app.use(session({secret: 'secret', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: true})); // following the documentation

// SET port

app.set('port', 8080);

// si l'url est:
// monApp/protected
app.get('/protected', (req, res) => {
  if (req.session && req.session.admin) {
    res.status(200).send('<img src="https://yt3.ggpht.com/-Kcd3KMxoqzw/AAAAAAAAAAI/AAAAAAAAAAA/EvhGpQ4rsh8/s900-c-k-no-mo-rj-c0xffffff/photo.jpg">');
  } else {
    res.status(403).send('<img src="http://iconshow.me/media/images/ui/Streamline-Icon/png/512/88-lock-locker-streamline.png">'); // 403 Forbidden
  }
});

// si l'url est:
// monApp/authentication
app.get('/authentication', (req, res) => {
  // La condition ci-dessous équivaut à
  // monApp/authentication?user=admin&password=azerty
  if (req.query.password == 'azerty' && req.query.user == 'admin') {
    // les identifiants sont bons
    // je met à jour la connection de mon utilisateur

    req.session.admin = true;

    // je lui renvoie une réponse adéquat, code HTTP 200 (ok)
    // et un message spécifiant que je suis authentifié
    res.status(200).send('<img src="https://i.ytimg.com/vi/6oWjaMeHmRs/maxresdefault.jpg">');
  } else {
    // je retourne une erreur spécifiant que les identifiants sont pas bons
    // avec le code HTTP (400) mauvaise requête
    res.status(400).send('<img src="http://abovethelaw.com/wp-content/uploads/2014/09/access-denied.jpg">');
  }
});

server.listen(app.get('port'), () => {
  console.log('server listening on *:' + app.get('port'));
});
