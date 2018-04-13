const Sequelize = require('sequelize');

module.exports = {
  service: {
    id: {
      type: Sequelize.UUID,
      unique: true,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    name: Sequelize.CHAR(50),
    url: Sequelize.CHAR(50)
  },
  role: {
    id: {
      type: Sequelize.UUID,
      unique: true,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    serviceId: Sequelize.UUID,
    name: Sequelize.CHAR(50),
    api: Sequelize.CHAR(50)
  },
  action: {
    id: {
      type: Sequelize.UUID,
      unique: true,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    functionId: Sequelize.UUID,
    name: Sequelize.CHAR(50),
    api: Sequelize.CHAR(50)
  },
  policyaction: {
    policyId: Sequelize.UUID,
    actionId: Sequelize.UUID,
  },
  policy: {
    id: {
      type: Sequelize.UUID,
      unique: true,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    name: Sequelize.CHAR(50)
  },
  accountpolicy: {
    policyId: Sequelize.UUID,
    accountId: Sequelize.UUID,
  },
  account: {
    id: {
      type: Sequelize.UUID,
      unique: true,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    clientId: Sequelize.UUID,
    username: Sequelize.CHAR(50),
    password: Sequelize.CHAR(50),
    firstName: Sequelize.CHAR(50),
    lastName: Sequelize.CHAR(50)
  },
  client: {
    id: {
      type: Sequelize.UUID,
      unique: true,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    code: Sequelize.CHAR(100),
    name: Sequelize.CHAR(50),
    url: Sequelize.CHAR(50),
    address: Sequelize.CHAR(50)
  }
}
