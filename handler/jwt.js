var token = require('jsonwebtoken');
var jwt = {}

jwt.createToken = function(payload,secret) {
  return new Promise((resolve,reject) => {
    if (secret === undefined) {
      reject({status:500,message:"missing in serect key"});
    }
    if (payload.user === undefined ||
     payload.role === undefined ||
     payload.client === undefined) {
      reject({status:400,message:"missing in payload"});
    }
    else {
      var tk = token.sign({
        data: payload
      }, 'secret', { expiresIn: '1m' });
      resolve({token:tk});
    }
  });
}

exports.jwt = jwt
