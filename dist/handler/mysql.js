'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _authentication = require('../models/authentication');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sequelize = require('sequelize');

var sha256 = require('sha256');

var Mysql = function () {
  function Mysql(sequelize, orms) {
    _classCallCheck(this, Mysql);

    this.sequelize = sequelize;
    this.orms = orms;
  }

  _createClass(Mysql, [{
    key: 'refreshLogin',
    value: function refreshLogin(accountId) {
      var sequelize = this.sequelize;
      var orms = this.orms;
      return new Promise(function (resolve, reject) {
        return sequelize.transaction(function (t) {
          return orms['account'].find({
            attributes: ['username', 'id'],
            where: {
              id: accountId
            }
          }, { transaction: t });
        }).then(function (account) {
          resolve(account.toJSON());
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: 'setRole',
    value: function setRole(body) {
      var sequelize = this.sequelize;
      var orms = this.orms;
      return new Promise(function (resolve, reject) {
        return sequelize.transaction(function (t) {
          return orms['policy'].find({
            attributes: ['id'],
            where: {
              name: body.policyName
            }
          }, { transaction: t }).then(function (res) {
            return orms['accountpolicy'].create({
              accountId: body.accountId,
              policyId: res.toJSON().id
            }, { transaction: t });
          });
        }).then(function (res) {
          resolve({ data: res.toJSON() });
        }).catch(function (err) {
          reject({ status: 400, message: err });
        });
      });
    }
  }, {
    key: 'login',
    value: function login(body) {
      var sequelize = this.sequelize;
      var orms = this.orms;
      return new Promise(function (resolve, reject) {
        return sequelize.transaction(function (t) {
          return orms['account'].findOne({
            attributes: ['username', 'password_hash', 'id'],
            where: {
              username: body.username
            }
          }, { transaction: t }).then(function (account) {
            if (account.toJSON().password_hash == sha256(body.password)) {
              resolve(account.toJSON());
            } else {
              reject({ status: 400, error: { message: "wrong password" } });
            }
          }).catch(function (err) {
            console.log(err);
            reject({ status: 400, error: err });
          });
        });
      });
    }
  }, {
    key: 'register',
    value: function register(body) {
      var sequelize = this.sequelize;
      var orms = this.orms;
      return new Promise(function (resolve, reject) {
        return sequelize.transaction(function (t) {
          return orms['client'].findOne({
            attributes: ['id'],
            where: {
              name: body.clientName
            }
          }, { transaction: t }).then(function (res) {
            if (res === null) {
              return orms['client'].create({
                name: body.clientName,
                code: body.clientcode,
                url: body.clienturl,
                address: body.clientaddress
              }, { transaction: t }).then(function (res) {
                return orms['account'].create({
                  clientId: res.toJSON().id,
                  username: body.username,
                  password: body.password,
                  firstName: body.firstName,
                  lastName: body.lastName
                }, { transaction: t });
              });
            } else {
              return orms['account'].create({
                clientId: res.toJSON().id,
                username: body.username,
                password: body.password,
                firstName: body.firstName,
                lastName: body.lastName
              }, { transaction: t });
            }
          });
        }).then(function (res) {
          var data = res.toJSON();
          delete data.password_hash;
          delete data.password;
          resolve(data);
        }).catch(function (err) {
          delete err.errors[0].instance;
          reject({ status: 400, message: err.errors });
        });
      });
    }
  }, {
    key: 'close',
    value: function close() {
      return this.sequelize.close();
    }
  }, {
    key: 'authenticate',
    value: function authenticate() {
      return this.sequelize.authenticate();
    }
  }, {
    key: 'mockup',
    value: function mockup() {
      return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
          return orms['service'].bulkCreate([{ name: "STM", url: "stm.smartlog.com" }, { name: "Bidding", url: "bidding.smartlog.com" }, { name: "SWM", url: "swm.smartlog.com" }]);
        }).then(function (res) {
          return orms['role'].bulkCreate([{ serviceId: res[0].toJSON().id, name: "admin", api: "admin.api" }, { serviceId: res[1].toJSON().id, name: "editor", api: "editor.api" }, { serviceId: res[2].toJSON().id, name: "reader", api: "reader.api" }]);
        }).then(function (res) {
          return orms['action'].bulkCreate([{ roleId: res[0].toJSON().id, name: "full", api: "full.api" }, { roleId: res[1].toJSON().id, name: "readwrite", api: "readwrite.api" }, { roleId: res[2].toJSON().id, name: "readonly", api: "readonly.api" }]);
        }).then(function (res) {
          var actions = res;
          orms['policy'].bulkCreate([{ name: "full" }, { name: "readwrite" }, { name: "readonly" }]).then(function (res) {
            orms['policyaction'].bulkCreate([{ policyId: res[0].toJSON().id, actionId: actions[0].toJSON().id }, { policyId: res[1].toJSON().id, actionId: actions[1].toJSON().id }, { policyId: res[2].toJSON().id, actionId: actions[2].toJSON().id }]);
          });
        });
      });
    }
  }], [{
    key: 'syncModels',
    value: function syncModels(dbi) {
      if (dbi.host === undefined || dbi.host === '') {
        return Promise.reject({ error: "missing mysql host" });
      }
      if (dbi.database === undefined || dbi.database === '') {
        return Promise.reject({ error: "missing mysql database name" });
      }
      if (dbi.user === undefined || dbi.user === '') {
        return Promise.reject({ error: "missing mysql user" });
      }
      if (dbi.password === undefined) {
        return Promise.reject({ error: "missing mysql password" });
      }
      var host = dbi.host,
          database = dbi.database,
          user = dbi.user,
          password = dbi.password;
      // TODO : add options for performance

      var sequelize = new Sequelize(database, user, password, {
        host: host,
        dialect: 'mysql'
      });
      var orms = {};
      Object.entries(_authentication.schema).forEach(function (table) {
        orms[table[0]] = sequelize.define(table[0], table[1]);
      });

      Object.entries(_authentication.associations).forEach(function (association) {
        Object.entries(association[1]).forEach(function (a) {
          orms[association[0]].belongsTo(orms[a[0]], { foreignKey: orms[a[1]] });
        });
      });
      return sequelize.sync().then(function () {
        return Promise.resolve({ sequelize: sequelize, orms: orms });
      });
    }
  }, {
    key: 'connect',
    value: function connect(dbi) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.syncModels(dbi).then(function (res) {
          resolve(new Mysql(res.sequelize, res.orms));
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }]);

  return Mysql;
}();

exports.default = Mysql;