import Mysql from './handler/mysql';
import JWT from './handler/jwt';
import startServer from './server'
var log4js = require('log4js');
var logger = log4js.getLogger();

logger.level = process.env.LOG_LEVEL || 'error';

var port = process.env.PORT || 3000;

var dbHost = process.env.DB_HOST || ''
var dbName = process.env.DB_NAME || ''
var dbUser = process.env.DB_USER || ''
var dbPass = process.env.DB_PASSWORD || ''

var redisPort = process.env.REDIS_PORT || 6379
var redisHost = process.env.REDIS_HOST || 'localhost'
var jwtKey = process.env.JWT_KEY || ''
console.log(Mysql)
Mysql.connect({host:dbHost,database:dbName,user:dbUser,password:dbPass})
.then(db => {
  return JWT.connect(jwtKey,{port:redisPort,host:redisHost})
  .then(jwt => {
    return Promise.resolve({db,jwt})
  })
})
.then(connections => {
  startServer(connections,port)
})
.catch(err =>{
  logger.error(err)
})
