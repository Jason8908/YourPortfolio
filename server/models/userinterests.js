import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./users.js";

export const UserInterest = sequelize.define(
  "UserInterest",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    interest: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    quoteIdentifiers: false,
    tableName: "userinterests",
  },
);

UserInterest.belongsTo(User, { foreignKey: "userId" });
User.hasMany(UserInterest);
