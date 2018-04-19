import Sequelize from 'sequelize'
import {schema,associations} from '../models/authentication';
import sha256 from 'sha256'

export default class Mysql {
  constructor(sequelize,orms) {
    this.sequelize = sequelize
    this.orms = orms;
  }

  static syncModels(dbi) {
    if (dbi.host === undefined || dbi.host === '') {
      return Promise.reject({status:400,error:{description:'missing mysql host',code:'connect_db_fail'}})
    }
    if (dbi.database === undefined || dbi.database === '') {
      return Promise.reject({status:400,error:{description:'missing mysql database name',code:'connect_db_fail'}})
    }
    if (dbi.user === undefined || dbi.user === '') {
      return Promise.reject({status:400,error:{description:'missing mysql user',code:'connect_db_fail'}})
    }
    if (dbi.password === undefined) {
      return Promise.reject({status:400,error:{description:'missing mysql password',code:'connect_db_fail'}})
    }
    const {
      host,
      database,
      user,
      password,
    } = dbi
    // TODO : add options for performance
    var sequelize = new Sequelize(database, user, password,  {
      host: host,
      dialect: 'mysql'
    });
    var orms = {};
    Object.entries(schema).forEach(table => {
      orms[table[0]] = sequelize.define(table[0],table[1])
    });

    Object.entries(associations).forEach(association => {
      Object.entries(association[1]).forEach(a => {
        orms[association[0]].belongsTo(orms[a[0]],{foreignKey: orms[a[1]]})
      });
    });
    return sequelize.sync()
    .then(() => {
      return Promise.resolve({sequelize,orms})
    })

  }

  static connect(dbi) {
    return new Promise((resolve,reject) => {
      this.syncModels(dbi)
      .then(res => {
        resolve(new Mysql(res.sequelize,res.orms))
      })
      .catch(err => {
        reject(err)
      })
    });
  }

  refreshLogin(accountId) {
    if (accountId === undefined || accountId === '') {
      return Promise.reject({status:400,error:{description:'missing accountId',code:'refresh_login_fail'}})
    }
    var sequelize = this.sequelize
    var orms = this.orms
    return new Promise((resolve,reject) => {
      return sequelize.transaction((t) => {
        return orms['account'].find({
          attributes: ['username','id'],
          where: {
            id: accountId
          }
        },{transaction: t})
      }).then(account => {
        resolve(account.toJSON());
      }).catch((err) => {
        reject({status:400,error:{...err.errors,code:'refresh_login_fail'}})
      });
    });
  }

  setRole(body) {
    if (body.policyName === undefined || body.policyName === '') {
      return Promise.reject({status:400,error:{description:'missing policyName',code:'set_role_fail'}})
    }
    if (body.accountId === undefined || body.accountId === '') {
      return Promise.reject({status:400,error:{description:'missing accountId',code:'set_role_fail'}})
    }
    var sequelize = this.sequelize
    var orms = this.orms
    return new Promise((resolve,reject) => {
      return sequelize.transaction((t) => {
        return orms['policy'].find({
          attributes: ['id'],
          where: {
            name: body.policyName
          }
        },{transaction: t})
        .then(res => {
          return orms['accountpolicy'].create({
            accountId: body.accountId,
            policyId: res.toJSON().id,
          },{transaction: t})
        })
      })
      .then(res => {
        resolve({data:res.toJSON()});
      })
      .catch(err => {
        reject({message:err})
      });
    });
  }

  login(body) {
    if (body.username === undefined || body.username === '') {
      return Promise.reject({status:400,error:{description:'missing username',code:'login_fail'}})
    }
    if (body.password === undefined || body.password === '') {
      return Promise.reject({status:400,error:{description:'missing password',code:'login_fail'}})
    }
    var sequelize = this.sequelize
    var orms = this.orms
    return new Promise((resolve,reject) => {
      return sequelize.transaction((t) => {
        return orms['account'].findOne({
          attributes: ['username','password_hash','id'],
          where: {
            username: body.username
          }
        }, {transaction: t})
        .then(account => {
          if (account.toJSON().password_hash == sha256(body.password)) {
            resolve(account.toJSON());
          } else {
            reject({status:400,error:{description:'wrong password',code:'login_fail'}})
          }
        })
        .catch(err => {
          reject({status:400,error:{...err.errors,code:'login_fail'}})
        });
      });
    });
  }

  registerControler(orms,oClient,oAccount,t) {
    if (oAccount.clientId === null) {
      return orms['client'].create(oClient,{transaction: t})
      .then(res => {
        oAccount.clientId = res.toJSON().id
        return orms['account'].create(oAccount,{transaction: t})
      });
    } else {
      return orms['account'].create(oAccount,{transaction: t})
    }
  }

  register(body) {
    var sequelize = this.sequelize
    var orms = this.orms
    return new Promise((resolve,reject) => {
      return sequelize.transaction((t) => {
        return orms['client'].findOne({
          attributes: ['id'],
          where: {
            name: body.clientName
          }
        }, {transaction: t})
        .then(res => {
          var oClient = {
            name: body.clientName,
            code: body.clientcode,
            url: body.clienturl,
            address: body.clientaddress
          }
          var oAccount = {
            clientId: (res !== null ? res.toJSON().id : null),
            username: body.username,
            password: body.password,
            firstName: body.firstName,
            lastName: body.lastName
          }
          return this.registerControler(orms,oClient,oAccount,t)
        });
      }).then(res => {
        var data = res.toJSON()
        delete data.password_hash
        delete data.password
        resolve(data);
      }).catch(err => {
        delete err.errors[0].instance
        reject({status:400,error:{...err.errors, code:"register_fail"}})
      });
    });
  }

  close() {
    return this.sequelize.close()
  }

  authenticate() {
    return this.sequelize.authenticate()
  }

  mockup() {
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
}
