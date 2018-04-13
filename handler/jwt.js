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
      }, secretKey, { expiresIn: '1m' });
      resolve({token:tk,refresh_token:reftk});
    }
  });
}

module.exports = jwt
