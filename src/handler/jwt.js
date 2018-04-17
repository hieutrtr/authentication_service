var token = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');
var redis = require("redis")
var jwt = {}

export default class JWT {
  constructor(secretKey, redis) {
    this.secretKey = secretKey
    this.redis = redis
  }

  static connect(secretKey,redisInfo) {
    if (redisInfo.port === undefined || redisInfo.port === '') {
      return Promise.reject({status:400,error:{description:'missing port',code:'connect_cache_fail'}})
    }
    if (redisInfo.host === undefined || redisInfo.host === '') {
      return Promise.reject({status:400,error:{description:'missing host',code:'connect_cache_fail'}})
    }
    return Promise.resolve(new JWT(secretKey,redis.createClient(redisInfo.port,redisInfo.host)))
  }

  createLoginToken(payload) {
    if (payload.username === undefined || payload.username === '') {
      return Promise.reject({status:400,error:{description:'missing username',code:'create_token_fail'}})
    }
    if (payload.password_hash === undefined || payload.password_hash === '') {
      return Promise.reject({status:400,error:{description:'missing password',code:'create_token_fail'}})
    }
    if (payload.id === undefined || payload.id === '') {
      return Promise.reject({status:400,error:{description:'missing id',code:'create_token_fail'}})
    }
    var secretKey = this.secretKey
    return new Promise((resolve,reject) => {
      if (secretKey === undefined || secretKey === '') {
        reject({status:500,error:{description:'missing secretKey',code:'create_token_fail'}});
      }
      var reftk = uuidv1()
      this.redis.set(reftk,payload.id)
      var tk = token.sign({
        data: payload
      }, secretKey, { expiresIn: '15m' });
      resolve({token:tk,refresh_token:reftk});
    });
  }

  refreshToken(payload,refreshToken) {
    if (payload.username === undefined || payload.username === '') {
      return Promise.reject({status:400,error:{description:'missing username',code:'refresh_token_fail'}})
    }
    if (payload.id === undefined || payload.id === '') {
      return Promise.reject({status:400,error:{description:'missing id',code:'refresh_token_fail'}})
    }
    if (refreshToken === undefined || refreshToken === '') {
      return Promise.reject({status:400,error:{description:'missing refreshToken',code:'refresh_token_fail'}})
    }
    var secretKey = this.secretKey
    return new Promise((resolve,reject) => {
      if (secretKey === undefined || secretKey === '') {
        reject({status:500,error:{description:'missing secretKey',code:'refresh_token_fail'}});
      }
      this.redis.get(refreshToken, (err,id) => {
        if (id === payload.id) {
          var tk = token.sign({
            data: payload
          }, secretKey, { expiresIn: '15m' });
          resolve({token:tk});
        } else {
         reject({status:400,error:{description:'invalid refreshToken',code:'refresh_token_fail'}});
        }
      });
    });
  }

  revokeToken(id,refreshToken) {
    if (id === undefined || id === '') {
      return Promise.reject({status:400,error:{description:'missing id',code:'revoke_token_fail'}})
    }
    if (refreshToken === undefined || refreshToken === '') {
      return Promise.reject({status:400,error:{description:'missing refreshToken',code:'revoke_token_fail'}})
    }
    return new Promise((resolve,reject) => {
      this.redis.get(refreshToken, (err,rid) => {
        if (rid === id) {
          this.redis.del(refreshToken)
          resolve()
        } else {
         reject({status:400,error:{description:'invalid refreshToken',code:'refresh_token_fail'}});
        }
      });
    });
  }
}
