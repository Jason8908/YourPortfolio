import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Job = sequelize.define("Job", {
    externalId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    employer: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    benefits: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    jobTypes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    link: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    attributes: {
        type: DataTypes.TEXT,
        allowNull: true,
    }

}, {
    quoteIdentifiers: false,
    tableName: "jobs",
});
