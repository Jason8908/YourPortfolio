import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { Skill } from "../models/skills.js";
import { Op } from "sequelize";
import { ApiResponse } from "../entities/response.js";
import "dotenv/config";
import { Sequelize } from "sequelize";
import { Atrribute } from "../models/attributes.js";

export const skillsRouter = Router();

skillsRouter.get("/", isAuthenticated, async (req, res) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  const search = req.query.search || "";

  // Search for skills that are similar to the search term
  // const results = await Skill.findAndCountAll({
  //   where: { skillName: { [Op.iLike]: `%${search}%` } },
  //   limit: limit,
  //   offset: offset,
  //   order: [
  //     [Sequelize.fn("LENGTH", Sequelize.col("skillName")), "ASC"],
  //     ["skillName", "ASC"],
  //   ],
  // });

  const results = await Atrribute.findAndCountAll({
    where: { name: { [Op.iLike]: `%${search}%` }, isSkill: true },
    limit: limit,
    offset: offset,
    order: [
      [Sequelize.fn("LENGTH", Sequelize.col("name")), "ASC"],
      ["name", "ASC"],
    ],
  });

  const totalCount = results.count;
  const skills = results.rows.map((skill) => ({
    id: skill.id,
    name: skill.name,
  }));
  res.status(200).json(new ApiResponse(200, "", { totalCount, skills }));
});
