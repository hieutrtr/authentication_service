import auth from './routers/auth';
import role from './routers/role';
import account from './routers/account';
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express()

export default function(connections,port) {
  app.locals.db = connections.db
  app.locals.jwt = connections.jwt

  app.use(bodyParser.json());

  app.get('/', function (req, res) {
    res.send('SML Authentication')
  });

  app.use('/account',account);
  app.use('/auth',auth);
  app.use('/role',role)

  app.listen(port, function () {
    console.log('SML Authentication is listening on port ' + port + '!');
  });
}
