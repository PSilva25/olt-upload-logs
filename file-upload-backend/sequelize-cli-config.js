const path = require('path');

module.exports = {
  development: {
    username: "dev_user",
    password: "dev_password",
    database: "dev_db",
    host: "127.0.0.1",
    dialect: "postgres",
    migrationStorageTableName: "sequelize_meta"
  },
};