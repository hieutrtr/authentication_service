import role from './routers/role';
import account from './routers/account';
import express from 'express'
import bodyParser from 'body-parser'
import request from 'request'
var app = express()

export default function(connections,port) {
  app.locals.db = connections.db
  app.locals.jwt = connections.jwt

  app.use(bodyParser.json());

  app.get('/', function (req, res) {
    res.send('SML Authentication')
  });

  app.use('/account',account);
  app.use('/role',role)

  app.listen(port, function () {
    console.log('SML Authentication is listening on port ' + port + '!');
  });
}
