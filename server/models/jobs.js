import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Job = sequelize.define(
  "Job",
  {
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
      get() {
        let val = this.getDataValue("benefits")?.split(",");
        if (val?.length == 1 && val[0] == "") return [];
        return val;
      },
      set(val) {
        this.setDataValue("benefits", val?.join(","));
      },
    },
    jobTypes: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        let val = this.getDataValue("jobTypes")?.split(",");
        if (val?.length == 1 && val[0] == "") return [];
        return val;
      },
      set(val) {
        this.setDataValue("jobTypes", val?.join(","));
      },
    },
    link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attributes: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        let val = this.getDataValue("attributes")?.split(",");
        if (val?.length == 1 && val[0] == "") return [];
        return val;
      },
      set(val) {
        this.setDataValue("attributes", val?.join(","));
      },
    },
  },
  {
    quoteIdentifiers: false,
    tableName: "jobs",
  },
);
