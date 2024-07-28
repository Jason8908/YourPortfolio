import { Router } from "express";
import { isAuthenticated, setUserId } from "../middleware/auth.js";
import { HttpStatusCode } from "axios";
import { ApiResponse } from "../entities/response.js";
import "dotenv/config";
import { User } from "../models/users.js";
import { UserSkill } from "../models/userSkills.js";
import { Skill } from "../models/skills.js";
import { UserExperience } from "../models/userexperiences.js";
import { generateCoverLetterBrown, generateResumeBasic } from "../services/docx.js";
import { CoverLetter } from "../entities/cover-letter.js";
import { Balance } from "../models/balance.js";
import stream from "stream";
import { UserEducation } from "../models/usereducation.js";
import { AiService } from "../services/ai.js";

const PROJECT_ID = process.env.PROJECT_ID;
const REGION = process.env.GOOGLE_REGION;
const ModelLabelToVersion = {
  "gemini-flash-1.5": "gemini-1.5-flash-001",
  "gemini-pro-1.5": "gemini-1.5-pro-001",
};
const ModelToCost = {
  "gemini-1.5-flash-001": 0,
  "gemini-1.5-pro-001": 1,
};

export const genAiRouter = Router();

const getUserSkills = async (userId) => {
  const skills = await UserSkill.findAll({
    where: { userId },
    include: Skill,
  });
  return skills.map((skill) => skill.Skill.skillName);
};

const getUserExperience = async (userId) => {
  const experiences = await UserExperience.findAll({
    where: { userId },
  });
  return experiences.map((experience) => ({
    company: experience.company,
    position: experience.position,
    startDate: experience.startDate,
    endDate: experience.endDate,
    description: experience.description,
  }));
};

const getUserEducation = async (userId) => {
  const educations = await UserEducation.findAll({
    where: { userId },
  });
  return educations.map((education) => ({
    school: education.school,
    degree: education.degree,
    major: education.major,
    startDate: education.startDate,
    endDate: education.endDate,
    description: education.description,
  }));
};

const getUser = async (userId) => {
  const user = await User.findByPk(userId);
  return user;
};

const extractCoverLetterData = (
  paragraphs = [],
  user = null,
  jobData = null,
) => {
  // Parsing paragraphs
  let letterParagraphs = [];
  for (let i = 0; i < paragraphs.length; i++)
    letterParagraphs[i] = paragraphs[i];
  if (paragraphs.length > 4)
    letterParagraphs[3] = paragraphs[paragraphs.length - 1];
  // User information
  const fname = user ? user.fname : "";
  const lname = user ? user.lname : "";
  const email = user ? user.email : "";
  // Job information
  const company = jobData?.employer ? jobData.employer : "";
  const companyAddress = jobData?.address
    ? jobData.address
    : jobData?.location
      ? jobData.location
      : "";
  const location = jobData?.location
    ? companyAddress === jobData.location
      ? ""
      : jobData.location
    : "";
  return new CoverLetter(
    fname,
    lname,
    "",
    "",
    email,
    "Hiring Manager",
    company,
    companyAddress,
    location,
    letterParagraphs,
  );
};

const deductAICost = async (userId, model) => {
  const cost = ModelToCost[model];
  const balance = await Balance.findOne({ where: { userId } });
  balance.credits -= cost;
  await balance.save();
};

const getUserBalance = async (userId) => {
  let balance = await Balance.findOne({ where: { userId } });
  if (!balance) {
    balance = await Balance.create({ userId, balance: 0 });
    await balance.save();
  }
  return balance.credits;
};

genAiRouter.post(
  "/letter",
  isAuthenticated,
  setUserId,
  async (req, res, next) => {
    const userId = req.userId;
    if (!PROJECT_ID || !REGION)
      return res
        .status(HttpStatusCode.InternalServerError)
        .json(
          new ApiResponse(
            HttpStatusCode.InternalServerError,
            "Missing configuration environment variables.",
          ),
        );
    const user = await getUser(userId);
    if (!user)
      return res
        .status(HttpStatusCode.NotFound)
        .json(new ApiResponse(HttpStatusCode.NotFound, "User not found."));
    const skills = await getUserSkills(userId);
    if (!skills || skills.length === 0)
      return res
        .status(HttpStatusCode.BadRequest)
        .json(
          new ApiResponse(
            HttpStatusCode.BadRequest,
            "User requires at least one skill to generate a cover letter.",
          ),
        );
    const experiences = await getUserExperience(userId);
    if (!experiences || experiences.length === 0)
      return res
        .status(HttpStatusCode.BadRequest)
        .json(
          new ApiResponse(
            HttpStatusCode.BadRequest,
            "User requires at least one experience to generate a cover letter.",
          ),
        );
    const jobData = req.body.jobData;
    if (!jobData)
      return res
        .status(HttpStatusCode.BadRequest)
        .json(
          new ApiResponse(
            HttpStatusCode.BadRequest,
            "Missing job data in request body.",
          ),
        );
    const balance = await getUserBalance(userId);
    const modelParam = req.query.model || "gemini-flash-1.5";
    const model = ModelLabelToVersion[modelParam] || "gemini-1.5-flash-001";
    // Creating an instance of the AI service
    const aiService = new AiService({
      projectId: PROJECT_ID,
      region: REGION,
      maxOutput: 2500,
      aiModel: model
    });
    const cost = aiService.getCost();
    // Checking if the user has enough credits to generate a cover letter with the selected model
    if (balance < cost)
      return res
        .status(HttpStatusCode.BadRequest)
        .json(
          new ApiResponse(
            HttpStatusCode.BadRequest,
            "Insufficient credits to generate a cover letter with the selected model.",
          ),
        );
    let result = undefined;
    try {
      result = await aiService.generateCoverLetter(user, skills, experiences, jobData);
    }
    catch(err) {
      if (err.message.includes('429') || err.message.includes('Quota exceeded')) {
        return res
          .status(HttpStatusCode.TooManyRequests)
          .json(new ApiResponse(HttpStatusCode.TooManyRequests, "Too many requests received in one minute for this model. Please try again later or choose a different model."));
      }
      return next(err);
    }
    const paragraphs = result.response;
    const coverLetter = extractCoverLetterData(paragraphs, user, jobData);
    const buffer = await generateCoverLetterBrown(coverLetter);
    // Deducting the cost of generating a cover letter from the user's balance
    await deductAICost(userId, model);
    // Returning the generated cover letter as a docx file over Express
    const streamBuffer = new stream.PassThrough();
    streamBuffer.end(buffer);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=cover-letter.docx`,
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    streamBuffer.pipe(res);
    return next();
  },
);

genAiRouter.post(
  "/resume",
  isAuthenticated,
  setUserId,
  async (req, res, next) => {
    const userId = req.userId;
    if (!PROJECT_ID || !REGION)
      return res
        .status(HttpStatusCode.InternalServerError)
        .json(
          new ApiResponse(
            HttpStatusCode.InternalServerError,
            "Missing configuration environment variables.",
          ),
        );
    const user = await getUser(userId);
    if (!user)
      return res
        .status(HttpStatusCode.NotFound)
        .json(new ApiResponse(HttpStatusCode.NotFound, "User not found."));
    const skills = await getUserSkills(userId);
    if (!skills || skills.length === 0)
      return res
        .status(HttpStatusCode.BadRequest)
        .json(
          new ApiResponse(
            HttpStatusCode.BadRequest,
            "User requires at least one skill to generate a resume.",
          ),
        );
    const experiences = await getUserExperience(userId);
    if (!experiences || experiences.length === 0)
      return res
        .status(HttpStatusCode.BadRequest)
        .json(
          new ApiResponse(
            HttpStatusCode.BadRequest,
            "User requires at least one experience to generate a resume.",
          ),
        );
    const educations = await getUserEducation(userId);
    if (!educations || educations.length === 0)
      return res
        .status(HttpStatusCode.BadRequest)
        .json(
          new ApiResponse(
            HttpStatusCode.BadRequest,
            "User requires at least one education to generate a resume.",
          ),
        );
    const jobData = req.body.jobData;
    if (!jobData)
      return res
        .status(HttpStatusCode.BadRequest)
        .json(
          new ApiResponse(
            HttpStatusCode.BadRequest,
            "Missing job data in request body.",
          ),
        );
    const balance = await getUserBalance(userId);
    const modelParam = req.query.model || "gemini-flash-1.5";
    const model = ModelLabelToVersion[modelParam] || "gemini-1.5-flash-001";
    // Creating an instance of the AI Service
    const aiService = new AiService({
      projectId: PROJECT_ID,
      region: REGION,
      maxOutput: 2500,
      aiModel: model
    });
    const cost = aiService.getCost();
    if (balance < cost)
      return res
        .status(HttpStatusCode.BadRequest)
        .json(
          new ApiResponse(
            HttpStatusCode.BadRequest,
            "Insufficient credits to generate a resume with the selected model.",
          ),
        );
    let resume = undefined;
    try {
      resume = await aiService.generateResume(user, skills, experiences, educations, jobData);
    }
    catch(err) {
      if (err.message.includes('429') || err.message.includes('Quota exceeded')) {
        return res
          .status(HttpStatusCode.TooManyRequests)
          .json(new ApiResponse(HttpStatusCode.TooManyRequests, "Too many requests received in one minute for this model. Please try again later or choose a different model."));
      }
      return next(err);
    }
    // Creating the resume as a docx file
    const buffer = await generateResumeBasic(resume);
    // Deducting the cost of generating a resume from the user's balance
    await deductAICost(userId, model);
    // Returning the generated resume as a docx file over Express
    const streamBuffer = new stream.PassThrough();
    streamBuffer.end(buffer);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resume.docx`,
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    streamBuffer.pipe(res);
    return next();
});

