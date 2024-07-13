const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("dev_db", "dev_user", "dev_password", {
  host: "127.0.0.1",
  dialect: "postgres",
});

module.exports = sequelize;
