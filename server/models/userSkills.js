import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./users.js";
import { Skill } from "./skills.js";

export const UserSkill = sequelize.define(
  "UserSkill",
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
    skillId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Skill,
        key: "id",
      },
    },
  },
  {
    quoteIdentifiers: false,
    tableName: "userskills",
  },
);

User.belongsToMany(Skill, { through: UserSkill, foreignKey: "userId" });
Skill.belongsToMany(User, { through: UserSkill, foreignKey: "skillId" });
UserSkill.belongsTo(User, { foreignKey: "userId" });
UserSkill.belongsTo(Skill, { foreignKey: "skillId" });
