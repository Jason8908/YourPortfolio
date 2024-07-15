import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./users.js";

export const Balance = sequelize.define(
  "Balance",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    quoteIdentifiers: false,
    tableName: "balances",
  },
);

Balance.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Balance, { foreignKey: "userId" });
