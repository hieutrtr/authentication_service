'use strict';

var _mysql = require('./handler/mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _jwt = require('./handler/jwt');

var _jwt2 = _interopRequireDefault(_jwt);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log4js = require('log4js');
var logger = log4js.getLogger();

logger.level = process.env.LOG_LEVEL || 'error';

var port = process.env.PORT || 3000;

var dbHost = process.env.DB_HOST || '';
var dbName = process.env.DB_NAME || '';
var dbUser = process.env.DB_USER || '';
var dbPass = process.env.DB_PASSWORD || '';

var redisPort = process.env.REDIS_PORT || 6379;
var redisHost = process.env.REDIS_HOST || 'localhost';
var jwtKey = process.env.JWT_KEY || '';

_mysql2.default.connect({ host: dbHost, database: dbName, user: dbUser, password: dbPass }).then(function (db) {
  return _jwt2.default.connect(jwtKey, { port: redisPort, host: redisHost }).then(function (jwt) {
    return Promise.resolve({ db: db, jwt: jwt });
  });
}).then(function (connections) {
  (0, _server2.default)(connections, port);
}).catch(function (err) {
  logger.error(err);
});