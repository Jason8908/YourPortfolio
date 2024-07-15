import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./users.js";

export const UserEducation = sequelize.define("UserEducation", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  school: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  degree: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  major: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  gpa: {
    type: DataTypes.DECIMAL,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

User.hasMany(UserEducation);
UserEducation.belongsTo(User, { foreignKey: "userId" });
