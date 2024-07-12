import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./users.js";
import { Job } from "./jobs.js";

export const UserJob = sequelize.define(
  "UserJob",
  {},
  {
    quoteIdentifiers: false,
    tableName: "userjobs",
  },
);

User.belongsToMany(Job, { through: UserJob });
Job.belongsToMany(User, { through: UserJob });
UserJob.belongsTo(Job)
UserJob.belongsTo(User)
User.hasMany(UserJob)
Job.hasMany(UserJob)
