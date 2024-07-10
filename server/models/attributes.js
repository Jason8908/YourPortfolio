import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Atrribute = sequelize.define(
    "Atrribute",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        isSkill: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        quoteIdentifiers: false,
        tableName: "attributes",
    },
);
