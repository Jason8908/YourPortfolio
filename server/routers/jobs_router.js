import { Router } from "express";
// import { isAuthenticated } from "../middleware/auth";
import { getIndeedJobs, getIndeedJobsIds } from "../services/indeed.js";
import { Job } from "../models/jobs.js";
import { Op } from 'sequelize';
import { HttpStatusCode } from "axios";


export const jobsRouter = Router();

jobsRouter.get("/search", async (req, res) => {

    let ids = await getIndeedJobsIds({
        jobQuery: req.query.query,
        jobLocation: req.query.location,
        page: req.query.page
    })

    if (ids == null) {
        return res.status(HttpStatusCode.TooManyRequests).json({ error: "Please wait until calling this again" })
    }

    let jobs = await Job.findAll({
        where: {
            externalId: {
                [Op.in]: ids
            }
        }
    })

    let foundJobIds = jobs.map(job => job.externalId)

    let jobsToFind = ids.filter(id => !foundJobIds.includes(id))

    let newJobs = (await getIndeedJobs({ ids: jobsToFind }))
        .filter(res => !res.value.error) //comment out to find edge cases with data retrieval
        .map(res => res.value)

    try {
        await Job.bulkCreate(newJobs)
    }
    catch (e) {
        return res.status(500).json({
            error: `Cannot insert new data into database - ${e.toString()}`,
            data: newJobs
        })
    }

    return res.status(200).json({
        data: jobs.concat(newJobs)
    })
})