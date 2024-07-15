import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const DropdownValues = sequelize.define(
  "DropdownValues",
  {
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    quoteIdentifiers: false,
    tableName: "dropdownvalues",
  },
);
