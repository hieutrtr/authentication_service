var token = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');
var r = require("redis").createClient()
var jwt = {}

jwt.createLoginToken = function(payload,secretKey) {
  return new Promise((resolve,reject) => {
    if (secretKey === undefined || secretKey === '') {
      reject({status:500,message:"missing in serect key"});
    }
    if (payload.username === undefined ||
     payload.password === undefined) {
      reject({status:400,message:"missing in payload"});
    }
    else {
      var reftk = uuidv1()
      r.set(reftk,payload.id)
      var tk = token.sign({
        data: payload
      }, secretKey, { expiresIn: '15m' });
      resolve({token:tk,refresh_token:reftk});
    }
  });
}

jwt.refreshToken = function(payload,secretKey,refreshToken) {
  return new Promise((resolve,reject) => {
    if (secretKey === undefined || secretKey === '') {
      reject({status:500,message:"missing in serect key"});
    }
    if (payload.username === undefined ||
     payload.password === undefined) {
      reject({status:400,message:"missing in payload"});
    }
    else {
      console.log(refreshToken)
      r.get(refreshToken, function(err,id) {
        console.log('err',err)
        console.log('id',id)
        console.log(payload)
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

module.exports = jwt
