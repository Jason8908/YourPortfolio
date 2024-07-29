import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const City = sequelize.define(
  "City",
  {
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    quoteIdentifiers: false,
    tableName: "cities",
  },
);
