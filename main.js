var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var auth = require('./routers/auth')
var account = require('./routers/account')
// var role = require('routers/role')
var app = express()

var port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('SML Authentication')
});

app.use('/auth',auth);
app.use('/account',account);
// app.use('/role',role)

app.listen(3000, function () {
  console.log('SML Authentication is listening on port ' + port + '!');
});
