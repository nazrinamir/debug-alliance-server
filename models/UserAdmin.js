
module.exports = (sequelize, DataTypes) => {
    const UsersAdmin = sequelize.define("UserAdmin", {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
  
    });
  
    return UsersAdmin;
  };
  
  