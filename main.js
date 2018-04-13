var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var db = require('./handler/mysql');
var jwt = require('./handler/jwt');
var app = express()

var port = process.env.PORT || 3000;
var jwtKey = process.env.JWT_KEY
var dbHost = process.env.DB_HOST || ''
var dbName = process.env.DB_NAME || ''
var dbUser = process.env.DB_USER || ''
var dbPass = process.env.DB_PASSWORD || ''

if (jwtKey === undefined) {
  console.log('missing JWT key (JWT_KEY)')
  return
}

conn = db.connect({host:dbHost,database:dbName,user:dbUser,password:dbPass})
if (conn.error) {
  console.log(conn.error)
  return
}
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('SML Authentication')
});

app.post('/reg', function(req, res) {
  conn.register(req.body)
  .then(result => {
    res.send({message:"register succesfully",data:result.data})
  })
  .catch(err => {
    res.status(err.status).send(err.message)
  });
});

app.post('/login', function(req, res) {
  console.log(conn)
  conn.login(req.body)
  .then(result => {
    jwt.createLoginToken(result, jwtKey)
    .then(result => {
      res.send({message:"login succesfully",token:result.token})
    })
    .catch(err => {
      res.status(err.status).send(err.message)
    });
  })
  .catch(err => {
    res.status(err.status).send(err.message)
  });
});

app.post('/logout', function(req, res) {
    conn.login(req.body)
    .then(result => {
      res.send({message:"logout succesfully"})
    })
    .catch(err => {
      res.status(err.status).send(err.message)
    });
});


app.listen(3000, function () {
  console.log('SML Authentication is listening on port ' + port + '!');
});
