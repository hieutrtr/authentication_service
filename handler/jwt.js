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
    return Promise.resolve(new JWT(secretKey,redis.createClient(redisInfo.port,redisInfo.host)))
  }

  createLoginToken(payload) {
    var secretKey = this.secretKey
    return new Promise((resolve,reject) => {
      if (secretKey === undefined || secretKey === '') {
        reject({status:500,message:"missing in serect key"});
      }
      if (payload.username === undefined ||
       payload.password_hash === undefined ||
        payload.id === undefined) {
        reject({status:400,message:"missing in payload"});
      }
      else {
        var reftk = uuidv1()
        this.redis.set(reftk,payload.id)
        var tk = token.sign({
          data: payload
        }, secretKey, { expiresIn: '15m' });
        resolve({token:tk,refresh_token:reftk});
      }
    });
  }

  refreshToken(payload,refreshToken) {
    var secretKey = this.secretKey
    return new Promise((resolve,reject) => {
      if (secretKey === undefined || secretKey === '') {
        reject({status:500,message:"missing in serect key"});
      }
      if (payload.username === undefined ||
       payload.id === undefined) {
        reject({status:400,message:"missing in payload"});
      }
      else {
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
      }
    });
  }

  revokeToken(id,refreshToken) {
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
