import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserModel = (sequelize) => {
const User = sequelize.define('User', {
    email: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
  validate: {
    isEmail: true
  }
},

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    }
    }, {
      tableName: 'Users',
      timestamps: true
});

return User;
};

export default User;