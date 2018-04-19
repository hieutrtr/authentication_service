import token from 'jsonwebtoken'
import uuidv1 from 'uuid/v1'
import redis from 'redis'
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
  /*
    Sign token and refresh_token with secretKey
    response {
      token: include username,password_hash,accountId(id),role
      refresh_token: include accountId(id)
    }
  */
  createToken(payload) {
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
      var reftk = token.sign({
        data: {accountId:payload.id,type:"refresh_token"}
      }, secretKey, { expiresIn: '15d' });
      var tk = token.sign({
        data: payload
      }, secretKey, { expiresIn: '15m' });
      resolve({token:tk,refresh_token:reftk});
    });
  }
  /*
    Refresh access token
    1. Check blacklist of refreshToken in redis
    2. Verify accountId in refreshToken's payload
    response new access token
  */
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
      this.redis.get(refreshToken, (err,rid) => {
        if (rid === payload.id) {
          this.redis.del(refreshToken)
          reject({status:400,error:{description:'refreshToken was blacklisted',code:'refresh_token_fail'}});
        } else {
          token.verify(refreshToken, secretKey, (err, decoded) => {
            if (decoded.data.accountId === payload.id && decoded.data.type === "refresh_token") {
              var tk = token.sign({
                data: payload
              }, secretKey, { expiresIn: '15m' });
              resolve({token:tk});
            } else {
             reject({status:400,error:{description:'invalid refreshToken',code:'refresh_token_fail'}});
            }
          });
        }
      });
    });
  }

  /*
    Blacklist refreshToken with accountId.
    store refreshToken in redis with expired time equal expired time of refreshToken
  */
  revokeToken(id,refreshToken) {
    if (id === undefined || id === '') {
      return Promise.reject({status:400,error:{description:'missing id',code:'revoke_token_fail'}})
    }
    if (refreshToken === undefined || refreshToken === '') {
      return Promise.reject({status:400,error:{description:'missing refreshToken',code:'revoke_token_fail'}})
    }
    var secretKey = this.secretKey
    return new Promise((resolve,reject) => {
      token.verify(refreshToken, secretKey, (err, decoded) => {
        if (decoded.data.accountId === id && decoded.data.type === "refresh_token") {
          this.redis.set(refreshToken,id)
          resolve()
        } else {
         reject({status:400,error:{description:'invalid refreshToken',code:'revoke_token_fail'}});
        }
      });
    })
  }
}
