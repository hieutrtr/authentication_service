const Sequelize = require('sequelize');
var sequelize
var db = {};
var conn = {};
var orms = {};

conn.mockup = () => {
  return new Promise((resolve,reject) => {
    sequelize.sync()
    .then(() => {
      return orms['service'].bulkCreate([
        {name:"STM",url:"stm.smartlog.com"},
        {name:"Bidding",url:"bidding.smartlog.com"},
        {name:"SWM",url:"swm.smartlog.com"},
      ])
    })
    .then(res => {
        return orms['role'].bulkCreate([
          {serviceId:res[0].toJSON().id,name:"admin",api:"admin.api"},
          {serviceId:res[1].toJSON().id,name:"editor",api:"editor.api"},
          {serviceId:res[2].toJSON().id,name:"reader",api:"reader.api"},
        ])
      })
    .then(res => {
      return orms['action'].bulkCreate([
        {roleId:res[0].toJSON().id,name:"full",api:"full.api"},
        {roleId:res[1].toJSON().id,name:"readwrite",api:"readwrite.api"},
        {roleId:res[2].toJSON().id,name:"readonly",api:"readonly.api"},
      ])
    })
    .then(res => {
      var actions = res;
      orms['policy'].bulkCreate([
        {name:"full"},
        {name:"readwrite"},
        {name:"readonly"},
      ])
      .then(res => {
        orms['policyaction'].bulkCreate([
          {policyId:res[0].toJSON().id,actionId:actions[0].toJSON().id},
          {policyId:res[1].toJSON().id,actionId:actions[1].toJSON().id},
          {policyId:res[2].toJSON().id,actionId:actions[2].toJSON().id},
        ])
      })
    })
  })
}

conn.setRole = (body) => {
  return new Promise((resolve,reject) => {
    sequelize.sync()
    .then(() => {
      orms['policy'].find({
        attributes: ['id'],
        where: {
          name: body.policyName
        }
      })
      .then(res => {
        orms['accountpolicy'].create({
          accountId: body.accountId,
          policyId: res.toJSON().id,
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

conn.login = (body) => {
  return new Promise((resolve,reject) => {
    sequelize.sync()
    .then(() => {
      orms['account'].find({
        attributes: ['username','password','id'],
        where: {
          username: body.username
        }
      })
      .then(account => {
        if (account.toJSON().password == body.password) {
          resolve(account.toJSON());
        } else {
          reject({status:400,message:"login fail"})
        }
      });
    });
  });
}

conn.refreshLogin = (body) => {
  return new Promise((resolve,reject) => {
    sequelize.sync()
    .then(() => {
      orms['account'].find({
        attributes: ['username','password','id'],
        where: {
          id: body.id
        }
      })
      .then(account => {
        resolve(account.toJSON());
      });
    });
  });
}

conn.logout = (body) => {
  return new Promise((resolve,reject) => {
    reject({status:400,message:"cannot logout"});
  });
}

conn.register = (body) => {
  return new Promise((resolve,reject) => {
    var client = {}
    sequelize.sync()
    .then(() => {
      return orms['client'].findOne({
        attributes: ['id'],
        where: {
          name: body.name
        }
      })
    })
    .then(res => {
      console.log(res)
      if (res === null) {
        return orms['client'].create({
          name: body.name,
          code: body.code,
          url: body.url,
          address: body.address
        })
      }
      return Promise.resolve(res)
    })
    .then(res => {
      client = res.toJSON();
      return orms['account'].create({
        clientId: client.id,
        username: body.username,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName
      })
    })
    .then(res => {
      var data = res.toJSON()
      data.accountId = data.id
      client.clientId = client.id
      resolve({...data, ...client});
    })
    .catch(err => {
      reject({status:400,message:err})
    })
  });
}

conn.close = () => {
  return sequelize.close()
}

conn.authenticate = function () {
  return sequelize.authenticate()
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

exports.connect = (dbi) => {
    res = createORM(dbi)
    if (res.error) {
      return res
    }
    const audb = require("../models/authentication")
    createDB(audb.schema)
    .then(associateDB(audb.association))
    return conn
}
