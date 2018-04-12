const Sequelize = require('sequelize');

exports.ua = {
  'service': {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true
    },
    name: Sequelize.CHAR(50),
    url: Sequelize.CHAR(50)
  },
  'role': {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true
    },
    serviceId: Sequelize.CHAR(36),
    name: Sequelize.CHAR(50),
    api: Sequelize.CHAR(50)
  },
  'action': {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true
    },
    functionId: Sequelize.CHAR(36),
    name: Sequelize.CHAR(50),
    api: Sequelize.CHAR(50)
  },
  'policyaction': {
    policyId: Sequelize.CHAR(36),
    actionId: Sequelize.CHAR(36)
  },
  'policy': {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true
    },
    name: Sequelize.CHAR(50)
  },
  'accountpolicy': {
    policyId: Sequelize.CHAR(36),
    accountId: Sequelize.CHAR(36)
  },
  'account': {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true
    },
    clientId: Sequelize.CHAR(36),
    username: Sequelize.CHAR(50),
    password: Sequelize.CHAR(50),
    firstName: Sequelize.CHAR(50),
    lastName: Sequelize.CHAR(50)
  },
  'client': {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true
    },
    code: Sequelize.CHAR(100),
    name: Sequelize.CHAR(50),
    url: Sequelize.CHAR(50),
    address: Sequelize.CHAR(50)
  }
}
