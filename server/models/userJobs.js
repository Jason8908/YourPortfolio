import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./users.js";
import { Job } from "./jobs.js";

export const UserJob = sequelize.define(
  "UserJob",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: User,
        key: "id",
      },
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Job,
        key: "id",
      },
    },
  },
  {
    quoteIdentifiers: false,
    tableName: "userjobs",
  },
);

User.belongsToMany(Job, { through: UserJob, foreignKey: "userId" });
Job.belongsToMany(User, { through: UserJob, foreignKey: "jobId" });
UserJob.belongsTo(User, { foreignKey: "userId" });
UserJob.belongsTo(Job, { foreignKey: "jobId" });
