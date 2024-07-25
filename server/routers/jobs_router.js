import { Router } from "express";
import { isAuthenticated, setUserId } from "../middleware/auth.js";
import { getIndeedJobsv2, getIndeedJobsIds } from "../services/indeed.js";
import { Job } from "../models/jobs.js";
import { UserJob } from "../models/userJobs.js";
import { Op } from "sequelize";
import { HttpStatusCode } from "axios";
import { ApiResponse } from "../entities/response.js";
import { User } from "../models/users.js";

export const jobsRouter = Router();

const checkSaved = (job) => {
  if (job.User?.length > 0) {
    job.saved = true;
  } else {
    job.saved = false;
  }
};

jobsRouter.get("/search", isAuthenticated, setUserId, async (req, res) => {
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
    include: [
      {
        model: User,
        through: {
          model: UserJob,
          where: {
            UserId: req.userId, // Replace specificUserId with the actual user ID you want to check
          },
        },
      },
    ],
  });

  let foundJobIds = jobs.map((job) => job.externalId);
  let jobsToFind = ids.filter((id) => !foundJobIds.includes(id));
  let newJobs = await getIndeedJobsv2({ ids: jobsToFind });
  let newJobsWithId = [];

  try {
    newJobsWithId = await Job.bulkCreate(newJobs);
  } catch (e) {
    return res.status(500).json({
      error: `Cannot insert new data into database - ${e.toString()}`,
      data: newJobs,
    });
  }

  let data = jobs.concat(newJobsWithId)
  data = data.map(elem => elem.get())
  console.log(data)
  data.forEach((job) => {
    console.log(job)
    job.saved = job.Users && job.Users.length > 0
    delete job.Users
  })


  return res.status(200).json(new ApiResponse(200, "", data));
});

jobsRouter.post("/:id/save", isAuthenticated, setUserId, async (req, res) => {
  try {
    let job = await Job.findByPk(req.params.id);
    if (job === null) {
      return res
        .status(404)
        .json(new ApiResponse(404, `Job Not Found with id ${req.params.id}`));
    }

    let savedJob = await UserJob.create({
      JobId: job.id,
      UserId: req.userId,
    });

    return res.status(201).json(new ApiResponse(201, "", savedJob));
  } catch (e) {
    console.log(e);
    return res.status(500).json(new ApiResponse(500, e.toString()));
  }
});

jobsRouter.delete("/:id/save", isAuthenticated, setUserId, async (req, res) => {
  try {
    let job = await Job.findByPk(req.params.id);
    if (job === null) {
      return res.status(404).json(new ApiResponse(404, "Job Not Found"));
    }

    let deletedJob = await UserJob.destroy({
      where: {
        JobId: job.id,
        UserId: req.userId,
      },
    });

    if (deletedJob == 0) {
      return res.status(500).json(new ApiResponse(500, "Job was not saved"));
    }

    return res.status(201).json(new ApiResponse(201, "Job Deleted"));
  } catch (e) {
    res.status(500).json(new ApiResponse(500, e));
  }
});

jobsRouter.get("/saved", isAuthenticated, setUserId, async (req, res) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;

  const results = await UserJob.findAndCountAll({
    where: { UserId: req.userId },
    limit: limit,
    offset: offset,
    include: Job,
    order: [["updatedAt", "DESC"]],
  });

  const totalCount = results.count;
  const jobs = results.rows;

  return res.status(200).json(new ApiResponse(200, "", { totalCount, jobs }));
});
