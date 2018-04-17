import Sequelize from 'sequelize'
import sha256 from 'sha256'

export const associations = {
  account:{client:'clientId'},
  accountpolicy:{account:'accountId',policy:'policyId'},
  policyaction:{policy:'policyId',action:'actionId'},
  action:{role:'roleId'},
  role:{service:'serviceId'}
}

export const schema = {
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
    roleId: Sequelize.UUID,
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
    username: {
      type: Sequelize.CHAR(50),
      unique: true,
      allowNull: false
    },
    password: {
     type: Sequelize.VIRTUAL,
     set: function (val) {
        this.setDataValue('password', val);
        this.setDataValue('password_hash', sha256(val));
      },
      validate: {
         isLongEnough: function (val) {
           if (val.length < 7) {
             throw new Error("Please choose a longer password")
          }
        }
      }
    },
    password_hash: Sequelize.STRING,
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
    name: {
      type: Sequelize.CHAR(50),
      unique: true,
      allowNull: false
    },
    url: Sequelize.CHAR(50),
    address: Sequelize.CHAR(50)
  }
}
