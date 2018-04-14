var router = require('express').Router();
var db = require('../handler/mysql');
var jwt = require('../handler/jwt');

var dbHost = process.env.DB_HOST || ''
var dbName = process.env.DB_NAME || ''
var dbUser = process.env.DB_USER || ''
var dbPass = process.env.DB_PASSWORD || ''
var jwtKey = process.env.JWT_KEY

if (jwtKey === undefined) {
  console.log('missing JWT key (JWT_KEY)')
  return
}

var conn = db.connect({host:dbHost,database:dbName,user:dbUser,password:dbPass})
if (conn.error) {
  console.log(conn.error)
  return
}

router.post('/', function(req, res) {
  if(req.body.refresh_token) {
    // TODO : optimize not hit db
    conn.refreshLogin(req.body)
    .then(result => {
      jwt.refreshToken(result, jwtKey, req.body.refresh_token)
      .then(result => {
        res.send({message:"refresh succesfully",result})
      })
      .catch(err => {
        res.status(err.status).send(err.message)
      });
    })
    .catch(err => {
      res.status(err.status).send(err.message)
    });
  } else {
    conn.login(req.body)
    .then(result => {
      jwt.createLoginToken(result, jwtKey)
      .then(result => {
        res.send({message:"login succesfully",result})
      })
      .catch(err => {
        res.status(err.status).send(err.message)
      });
    })
    .catch(err => {
      res.status(err.status).send(err.message)
    });
  }
});

router.delete('/', function(req, res) {
  if(req.body.refresh_token) {
    // TODO : optimize not hit db
    jwt.revokeToken(req.body.id,req.body.refresh_token)
    .then(result => {
      res.send({message:"revoke succesfully",result})
    })
    .catch(err => {
      res.status(err.status).send(err.message)
    });
  } else {
    res.status(400).send("refresh token is invalid")
  }
});

module.exports = router
