import { Router } from "express";
import { isAuthenticated, setUserId } from "../middleware/auth.js";
import { getIndeedJobsv2, getIndeedJobsIds } from "../services/indeed.js";
import { Job } from "../models/jobs.js";
import { Op } from "sequelize";
import { HttpStatusCode } from "axios";
import { ApiResponse } from "../entities/response.js";
import { UserJob } from "../models/userJobs.js";

export const jobsRouter = Router();

jobsRouter.get(isAuthenticated, "/search", async (req, res) => {
  let ids = await getIndeedJobsIds({
    jobQuery: req.query.query,
    jobLocation: req.query.location,
    page: req.query.page,
  });

  if (ids == null) {
    return res
      .status(HttpStatusCode.TooManyRequests)
      .json({ error: "Please wait until calling this again" });
  }



  let jobs = await Job.findAll({
    where: {
      externalId: {
        [Op.in]: ids,
      },
    },
  });

  let foundJobIds = jobs.map((job) => job.externalId);
  let jobsToFind = ids.filter((id) => !foundJobIds.includes(id));
  let newJobs = await getIndeedJobsv2({ ids: jobsToFind })
  let newJobsWithId = [];

  try {
    newJobsWithId = await Job.bulkCreate(newJobs);
  }
  catch (e) {
    return res.status(500).json({
      error: `Cannot insert new data into database - ${e.toString()}`,
      data: newJobs,
    });
  }

  return res.status(200).json({
    data: jobs.concat(newJobsWithId),
  });
});

jobsRouter.post(isAuthenticated, setUserId, "/:id/save", async (req, res) => {

  try {
    let job = await Job.findByPk(req.query.id)
    if (job === null) {
      res.status(404).json(ApiResponse(404, "Job Not Found"))
    }

    let savedJob = await UserJob.create({
      jobId: job.id, userId: req.userId
    })

    return res.status(201).json(ApiResponse(201, "", savedJob))
  }

  catch (e) {
    res.status(500).json(ApiResponse(500, e.toString()))
  }
})

jobsRouter.delete(isAuthenticated, setUserId, "/:id/save", async (req, res) => {

  try {
    let job = await Job.findByPk(req.query.id)
    if (job === null) {
      res.status(404).json(ApiResponse(404, "Job Not Found"))
    }

    let deletedJob = await UserJob.destroy({
      where: {
        jobId: job.id,
        userId: req.userId
      }
    })

    if (deletedJob == 0) {
      return res.status(500).json(ApiResponse(500, "Job could not be unsaved"))
    }

    return res.status(201).json(ApiResponse(201, "Job Deleted"))
  }

  catch (e) {
    res.status(500).json(ApiResponse(500, e))
  }
})

jobsRouter.get("/saved", isAuthenticated, setUserId, async (req, res) => {

  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;

  const results = await Job.findAndCountAll({
    where: { userId: req.userId },
    limit: limit,
    offset: offset,
    order: [
      ["updatedAt", "DESC"],
    ],
  });

  const totalCount = results.count;
  const jobs = results.rows;

  res.status(200).json(new ApiResponse(200, "", { totalCount, jobs }));
});
