var db = require('../handler/mysql')

var dbHost = process.env.DB_HOST || ''
var dbName = process.env.DB_NAME || ''
var dbUser = process.env.DB_USER || ''
var dbPass = process.env.DB_PASSWORD || ''

var conn = db.connect({host:dbHost,database:dbName,user:dbUser,password:dbPass})
if (conn.error) {
  console.log(conn.error)
  return
}

conn.mockup()
