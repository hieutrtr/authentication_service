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
      return Promise.reject({error:'missing port'})
    }
    if (redisInfo.host === undefined || redisInfo.host === '') {
      return Promise.reject({error:'missing host'})
    }
    return Promise.resolve(new JWT(secretKey,redis.createClient(redisInfo.port,redisInfo.host)))
  }

  createLoginToken(payload) {
    if (payload.username === undefined || payload.username === '') {
      return Promise.reject({error:'missing username'})
    }
    if (payload.password_hash === undefined || payload.password_hash === '') {
      return Promise.reject({error:'missing password'})
    }
    if (payload.id === undefined || payload.id === '') {
      return Promise.reject({error:'missing id'})
    }
    var secretKey = this.secretKey
    return new Promise((resolve,reject) => {
      if (secretKey === undefined || secretKey === '') {
        reject({status:500,error:"missing in serect key"});
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
      return Promise.reject({error:'missing username'})
    }
    if (payload.id === undefined || payload.id === '') {
      return Promise.reject({error:'missing id'})
    }
    if (refreshToken === undefined || refreshToken === '') {
      return Promise.reject({error:'missing refreshToken'})
    }
    var secretKey = this.secretKey
    return new Promise((resolve,reject) => {
      if (secretKey === undefined || secretKey === '') {
        reject({status:500,message:"missing in serect key"});
      }
      this.redis.get(refreshToken, (err,id) => {
        if (id === payload.id) {
          var tk = token.sign({
            data: payload
          }, secretKey, { expiresIn: '15m' });
          resolve({token:tk});
        } else {
         reject({status:400,message:"refresh token is invalid"});
        }
      });
    });
  }

  revokeToken(id,refreshToken) {
    if (id === undefined || id === '') {
      return Promise.reject({error:'missing id'})
    }
    if (refreshToken === undefined || refreshToken === '') {
      return Promise.reject({error:'missing refreshToken'})
    }
    return new Promise((resolve,reject) => {
      this.redis.get(refreshToken, (err,rid) => {
        if (rid === id) {
          this.redis.del(refreshToken)
          resolve()
        } else {
         reject({status:400,message:"refresh token is invalid"});
        }
      });
    });
  }
}
