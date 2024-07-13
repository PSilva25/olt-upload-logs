const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Reg = sequelize.define("Reg", {
  olt: {
    type: DataTypes.STRING,
  },
  slot: {
    type: DataTypes.STRING,
  },
  port: {
    type: DataTypes.STRING,
  },
  ont_id: {
    type: DataTypes.STRING,
  },
  sn: {
    type: DataTypes.STRING,
  },
  run_state: {
    type: DataTypes.STRING,
  },
  config_state: {
    type: DataTypes.STRING,
  },
  match_state: {
    type: DataTypes.STRING,
  },
});

module.exports = Reg;
