'use strict';

// LIBRARIES

const express         = require('express');
const app             = express();
const server          = require('http').Server(app);
const bodyParser      = require('body-parser');
const MongoClient     = require('mongodb').MongoClient;

// URL FOR DATABASE

var url = process.env.MONGO || 'mongodb://10.40.0.18:27017/stateless-app';

// JSON API REST

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// SET port

app.set('port', 8080);

// si l'url est:
// monApp/protected
app.get('/protected', (req, res) => {
  if (req.query.token) {
    getToken(req.query.token, (err, tokens) => {
      if (err) res.status(500).send(err);
      else {
        if (tokens.length >= 1) {
          res.status(200).send('<img src="https://yt3.ggpht.com/-Kcd3KMxoqzw/AAAAAAAAAAI/AAAAAAAAAAA/EvhGpQ4rsh8/s900-c-k-no-mo-rj-c0xffffff/photo.jpg">');
        } else {
          res.status(403).send('<img src="http://iconshow.me/media/images/ui/Streamline-Icon/png/512/88-lock-locker-streamline.png">'); // 403 Forbidden
        }
      }
    });
  } else {
    res.status(401).send('<img src="http://iconshow.me/media/images/ui/Streamline-Icon/png/512/88-lock-locker-streamline.png">'); // 401 Unauthorized
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

    var token = Math.random().toString(36).substring(2,12); // metuls9c3a
    pushToken(token);

    // je lui renvoie une réponse adéquat, code HTTP 200 (ok)
    // et un message spécifiant que je suis authentifié
    res.status(200).send(`<p>{
      code: 200,
      authenticated: true,
      token: ${token}
    }</p><img src="https://i.ytimg.com/vi/6oWjaMeHmRs/maxresdefault.jpg">`);
  } else {
    // je retourne une erreur spécifiant que les identifiants sont pas bons
    // avec le code HTTP (400) mauvaise requête
    res.status(400).send('<img src="http://abovethelaw.com/wp-content/uploads/2014/09/access-denied.jpg">');
  }
});

server.listen(app.get('port'), () => {
  console.log('server listening on *:' + app.get('port'));
});

function pushToken(token, cb) {
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    if (!err) {
      console.log('Connected correctly to server');
      db.collection('tokens').insert({'token':token}, cb);
    } else {
      console.log('error');
      console.log(err);
    }
  });
}

function getToken(token, cb) {
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    if (!err) {
      console.log('Connected correctly to server');
      db.collection('tokens').find({'token':token}).toArray(cb);
    } else {
      console.log('error');
      console.log(err);
    }
  });
}
