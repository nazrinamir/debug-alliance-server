module.exports = (sequelize, DataTypes) => {
  const PlayerData = sequelize.define("PlayerData", {
    src: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foot: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    yellow_card: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    red_card: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    injuries: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    appearances: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return PlayerData;
}; 