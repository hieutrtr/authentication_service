const Sequelize = require('sequelize');
var sequelize
var db = {};
var conn = {};
var orms = {};

conn.login = function(body) {
  return new Promise((resolve,reject) => {
    resolve({user:"hieu",role:"admin",client:"smartlog"});
  });
}

conn.logout = function(body) {
  return new Promise((resolve,reject) => {
    reject({status:400,message:"cannot logout"});
  });
}

conn.register = function(body) {
  return new Promise((resolve,reject) => {
    sequelize.sync()
    .then(() => {
      orms['client'].create({
        name: body.name,
        code: body.code,
        url: body.url,
        address: body.address
      })
      .then(res => {
        // console.log(res)
        console.log(res.toJSON().id);
        orms['account'].create({
          clientId: res.toJSON().id,
          username: body.username,
          password: body.password,
          firstName: body.firstName,
          lastName: body.lastName
        })
        .then(res => {
          resolve({data:res.toJSON()});
        })
        .catch(err => {
          reject({status:400,message:err})
        })
      })
      .catch(err => {
        reject({status:400,message:err})
      })
    })
    .catch(err => {
      reject({status:500,message:err})
    });
  });
}

function createORM(dbi) {
  if (dbi.host === undefined || dbi.host === '') {
    return {error:"missing mysql host"}
  }
  if (dbi.database === undefined || dbi.database === '') {
    return {error:"missing mysql database name"}
  }
  if (dbi.user === undefined || dbi.user === '') {
    return {error:"missing mysql user"}
  }
  if (dbi.password === undefined) {
    return {error:"missing mysql password"}
  }
  host = dbi.host
  database = dbi.database
  user = dbi.user
  password = dbi.password
  // TODO : add options for performance
  sequelize = new Sequelize(database, user, password,  {
    host: host,
    dialect: 'mysql'
  });
  return {}
}

function createDB(uadb) {
  return new Promise((resolve,reject) => {
    Object.entries(uadb).forEach(table => {
      orms[table[0]] = sequelize.define(table[0],table[1])
    });
    resolve()
  });
}

function associateDB(associations) {
  Object.entries(associations).forEach(association => {
    Object.entries(association[1]).forEach(a => {
      orms[association[0]].belongsTo(orms[a[0]],{foreignKey: orms[a[1]]})
    });
  });
}

exports.connect = function(dbi) {
    res = createORM(dbi)
    if (res.error) {
      return res
    }
    const audb = require("../models/authentication")
    createDB(audb.schema)
    .then(associateDB(audb.association))
    return conn
}
