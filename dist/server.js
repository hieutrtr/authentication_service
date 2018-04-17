'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (connections, port) {
  app.locals.db = connections.db;
  app.locals.jwt = connections.jwt;

  app.use(bodyParser.json());

  app.get('/', function (req, res) {
    res.send('SML Authentication');
  });

  app.use('/account', _account2.default);
  app.use('/role', _role2.default);

  app.listen(port, function () {
    console.log('SML Authentication is listening on port ' + port + '!');
  });
};

var _role = require('./routers/role');

var _role2 = _interopRequireDefault(_role);

var _account = require('./routers/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();