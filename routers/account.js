var router = require('express').Router();
var db = require('../handler/mysql');

var dbHost = process.env.DB_HOST || ''
var dbName = process.env.DB_NAME || ''
var dbUser = process.env.DB_USER || ''
var dbPass = process.env.DB_PASSWORD || ''

var conn = db.connect({host:dbHost,database:dbName,user:dbUser,password:dbPass})
if (conn.error) {
  console.log(conn.error)
  return
}

router.post('/', (req, res) => {
  conn.register(req.body)
  .then(result => {
    res.send({message:"register succesfully",data:result.data})
  })
  .catch(err => {
    res.status(err.status).send(err.message)
  });
});

module.exports = router
