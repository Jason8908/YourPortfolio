import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Skill = sequelize.define(
  "Skill",
  {
    skillName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    quoteIdentifiers: false,
    tableName: "skills",
  },
);
