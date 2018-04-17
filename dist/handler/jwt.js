'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var token = require('jsonwebtoken');
var uuidv1 = require('uuid/v1');
var redis = require("redis");
var jwt = {};

var JWT = function () {
  function JWT(secretKey, redis) {
    _classCallCheck(this, JWT);

    this.secretKey = secretKey;
    this.redis = redis;
  }

  _createClass(JWT, [{
    key: 'createLoginToken',
    value: function createLoginToken(payload) {
      var _this = this;

      var secretKey = this.secretKey;
      return new Promise(function (resolve, reject) {
        if (secretKey === undefined || secretKey === '') {
          reject({ status: 500, message: "missing in serect key" });
        }
        if (payload.username === undefined || payload.password_hash === undefined || payload.id === undefined) {
          reject({ status: 400, message: "missing in payload" });
        } else {
          var reftk = uuidv1();
          _this.redis.set(reftk, payload.id);
          var tk = token.sign({
            data: payload
          }, secretKey, { expiresIn: '15m' });
          resolve({ token: tk, refresh_token: reftk });
        }
      });
    }
  }, {
    key: 'refreshToken',
    value: function refreshToken(payload, _refreshToken) {
      var _this2 = this;

      var secretKey = this.secretKey;
      return new Promise(function (resolve, reject) {
        if (secretKey === undefined || secretKey === '') {
          reject({ status: 500, message: "missing in serect key" });
        }
        if (payload.username === undefined || payload.id === undefined) {
          reject({ status: 400, message: "missing in payload" });
        } else {
          _this2.redis.get(_refreshToken, function (err, id) {
            if (id === payload.id) {
              var tk = token.sign({
                data: payload
              }, secretKey, { expiresIn: '15m' });
              resolve({ token: tk });
            } else {
              reject({ status: 400, message: "refresh token is invalid" });
            }
          });
        }
      });
    }
  }, {
    key: 'revokeToken',
    value: function revokeToken(id, refreshToken) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.redis.get(refreshToken, function (err, rid) {
          if (rid === id) {
            _this3.redis.del(refreshToken);
            resolve();
          } else {
            reject({ status: 400, message: "refresh token is invalid" });
          }
        });
      });
    }
  }], [{
    key: 'connect',
    value: function connect(secretKey, redisInfo) {
      return Promise.resolve(new JWT(secretKey, redis.createClient(redisInfo.port, redisInfo.host)));
    }
  }]);

  return JWT;
}();

exports.default = JWT;