import { Router } from "express";
import "dotenv/config";
import { DropdownValues } from '../models/dropdownValues.js';
import { DropdownTypes } from '../constants/dropdownTypes.js';
import { ApiResponse } from "../entities/response.js";
import { HttpStatusCode } from "axios";
import { Op, Sequelize } from "sequelize";

export const dropdownRouter = Router();

const getDropdownValues = async (limit, offset, search, type) => {
  const results = await DropdownValues.findAndCountAll({
    where: { value: { [Op.iLike]: `%${search}%` }, type },
    limit: limit,
    offset: offset,
    order: [
      [Sequelize.fn("LENGTH", Sequelize.col("value")), "ASC"],
      ["value", "ASC"],
    ],
  });
  const values = results.rows.map((item) => {
    return {
      id: item.id,
      label: item.label,
      value: item.value,
      description: item.description || ""
    }
  });
  return { totalCount: results.count, values };
}

dropdownRouter.get("/values/schools", async (req, res) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  const search = req.query.search || "";
  const result = await getDropdownValues(limit, offset, search, DropdownTypes.SchoolOptions);
  return res.status(HttpStatusCode.Ok).json(new ApiResponse(HttpStatusCode.Ok, "", result));
});

dropdownRouter.get("/values/majors", async (req, res) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  const search = req.query.search || "";
  const result = await getDropdownValues(limit, offset, search, DropdownTypes.MajorOptions);
  return res.status(HttpStatusCode.Ok).json(new ApiResponse(HttpStatusCode.Ok, "", result));
});

dropdownRouter.get("/values/degrees", async (req, res) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  const search = req.query.search || "";
  const result = await getDropdownValues(limit, offset, search, DropdownTypes.DegreeOptions);
  return res.status(HttpStatusCode.Ok).json(new ApiResponse(HttpStatusCode.Ok, "", result));
});


