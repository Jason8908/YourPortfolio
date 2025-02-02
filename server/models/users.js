import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    googleRefreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    quoteIdentifiers: false,
    tableName: "users",
  },
);
