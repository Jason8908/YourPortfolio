import { Router } from "express";
import { isAuthenticated, setUserId } from "../middleware/auth.js";
import { HttpStatusCode } from "axios";
import { ApiResponse } from "../entities/response.js";
import "dotenv/config";
import { VertexAI } from "@google-cloud/vertexai";
import { User } from "../models/users.js";
import { UserSkill } from "../models/userSkills.js";
import { Skill } from "../models/skills.js";
import { UserExperience } from "../models/userexperiences.js";
import { generateCoverLetterBrown, generateResumeBasic } from "../services/docx.js";
import { CoverLetter } from "../entities/cover-letter.js";
import { Balance } from "../models/balance.js";
import stream from "stream";
import { Resume } from "../entities/resume.js";
import { UserEducation } from "../models/usereducation.js";

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

const generateEducationOptionsString = (educations) => {
  let result = "";
  for (let i = 0; i < educations.length; i++)
    result += `${i+1}. ${educations[i].degree} in ${educations[i].major} at ${educations[i].school}\n`;
  return result;
};

const generateExperienceOptionsString = (experiences) => {
  let result = "";
  for (let i = 0; i < experiences.length; i++)
    result += `${i+1}. ${experiences[i].position} at ${experiences[i].company}\n`;
  return result;
}

const generateExperienceString = (experience) => {
  const startDate = experience.startDate.toLocaleDateString();
  const endDate = experience.endDate ? experience.endDate.toLocaleDateString() : "Present";
  return `${experience.position} at ${experience.company} from ${startDate} to ${endDate}.`;
}

const createUserExperienceString = (experiences) => {
  return experiences
    .map((experience) => {
      const startDate = experience.startDate.toLocaleDateString();
      const endDate = experience.endDate
        ? experience.endDate.toLocaleDateString()
        : "Present";
      return `${experience.position} at ${experience.company} from ${startDate} to ${endDate}. Description: ${experience.description}`;
    })
    .join("\n");
};

const getUser = async (userId) => {
  const user = await User.findByPk(userId);
  return user;
};

const createJobDataString = (jobData) => {
  if (!jobData) return "";
  const position = jobData.title || "";
  const company = jobData.employer || "";
  let description = (jobData.description || "").split("\n");
  for (let i = 0; i < description.length; i++) {
    description[i] = description[i].trim();
    description[i] = description[i].replace(/<[^>]*>?/gm, "");
  }
  return `${position || "Some position"} at ${company || "some company"}. Description: ${description.join("\n")}`;
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

const promptVertexCoverLetter = async (
  user,
  experiences,
  jobData,
  skills,
  aiModel,
) => {
  const experiencesString = createUserExperienceString(experiences);
  const jobDataString = createJobDataString(jobData);
  // LLM Prompt to generate cover letter
  const prompt = `My name is ${user.fname} ${user.lname}. Write a cover letter for me; do not place any tokens in it.\n
    ${jobDataString ? `The following is the job posintg: \n${jobDataString}. \n` : ""}
    ${skills.length > 0 ? `My Skills: ${skills.join(", ")}. \n` : ""}
    ${experiencesString.length > 0 ? `Experiences: ${experiencesString}. \n` : ""}
    Do not include any text other than the actual cover letter itself.\n
    Do not include any placeholders or text that I may need to replace; absolutely NO '[' or ']' symbols; if there is missing information, make it generic and generally applicable.\n
    The cover letter must have an introduction, two body paragraphs, and a conclusion.\n
    Do NOT include the location where the job posting was found.\n
    Do NOT include the introductory line "Dear Hiring Manager" or the farewell line.\n`;
  const vertexAI = new VertexAI({ project: PROJECT_ID, location: REGION });
  const generativeModel = vertexAI.getGenerativeModel({
    model: aiModel,
  });
  const resp = await generativeModel.generateContent(prompt);
  const content = resp.response;
  const result = content.candidates.at(0).content.parts.at(0).text.split("\n");
  return result;
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
    const cost = ModelToCost[model];
    if (balance < cost)
      return res
        .status(HttpStatusCode.BadRequest)
        .json(
          new ApiResponse(
            HttpStatusCode.BadRequest,
            "Insufficient credits to generate a cover letter with the selected model.",
          ),
        );
    const paragraphs = await promptVertexCoverLetter(
      skills,
      experiences,
      jobData,
      skills,
      model,
    );
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

const formatDate = (date) => {
  // Return the date in the format "Month Year"
  return `${date.toLocaleString("default", {
    month: "long",
  })} ${date.getFullYear()}`;
}

const generateResumeObjective = async (vertex, jobDataString) => {
  const prompt = `Here is a job posting: ${jobDataString}\n
                  Generate an object statement for this job posting that will be put on a resume.\n
                  Do not send any text other than the obejctive statement itself.\n`;
  const resp = await vertex.generateContent(prompt);
  const content = resp.response;
  const result = content.candidates.at(0).content.parts.at(0).text.split("\n");
  return result[0];
};

const generateResumeSkills = async (vertex, jobDataString, skills) => {
  const prompt = `Here is a job posting: ${jobDataString}\n
                  Here is a list of skills that I possess: ${skills.join(", ")}\n
                  Generate a list of exactly 6 skills that are relevant to the job posting seperated by commas.
                  Do not send any text other than the skills as comma serpated values.\n`;
  const resp = await vertex.generateContent(prompt);
  const content = resp.response;
  const result = content.candidates.at(0).content.parts.at(0).text.split("\n");
  return result[0].split(",").map(item => item.trim());
}

const generateResumeEducations = async (vertex, jobDataString, educations) => {
  const educationOptions = generateEducationOptionsString(educations);
  const prompt = `Here is a job posting: ${jobDataString}\n
                  Here is a list of my education: ${educationOptions}\n
                  Generate a list of at most 3 education entries that are most relevant to the job posting.\n
                  Return this data as a list of numbers representing the order in which the options were presented in seperated by commas.\n
                  Do not send any text other than the numbers themselves.\n`;
  const resp = await vertex.generateContent(prompt);
  const content = resp.response;
  const result = content.candidates.at(0).content.parts.at(0).text.split("\n");
  const educationIndices = result[0].split(",").map(item => +(item.trim()));
  // Extracting the selected educations
  const selectedEducations = educations.filter((_, index) => educationIndices.includes(index + 1));
  let resumeEducations = [];
  for (const education of selectedEducations) {
    const degreeArr = [education.degree, education.major].filter(item => item);
    const startDateString = formatDate(education.startDate);
    const endDateString = education.endDate ? formatDate(education.endDate) : "Present";
    resumeEducations.push({
      degree: degreeArr.join(", "),
      institution: education.school,
      startDate: startDateString,
      endDate: endDateString,
      points: [education.description],
    });
  }
  return resumeEducations;
}

const generateResumeExperiences = async (vertex, jobDataString, experiences) => {
  const experienceOptions = generateExperienceOptionsString(experiences);
  const prompt = `Here is a job posting: ${jobDataString}\n
                  Here is a list of my experiences: ${experienceOptions}\n
                  Generate a list of at most 3 experience entries that are most relevant to the job posting.\n
                  Return this data as a list of numbers representing the order in which the options were presented in seperated by commas.\n
                  Do not send any text other than the numbers themselves.\n`;
  const resp = await vertex.generateContent(prompt);
  const content = resp.response;
  const result = content.candidates.at(0).content.parts.at(0).text.split("\n");
  const experienceIndices = result[0].split(",").map(item => +(item.trim()));
  // Extracting the selected experiences
  const selectedExperiences = experiences.filter((_, index) => experienceIndices.includes(index + 1));
  let resumeExperiences = [];
  for (const experience of selectedExperiences) {
    const experienceString = generateExperienceString(experience);
    const experiencePointsPrompt = `Here is a job posting: ${jobDataString}\n
                                    Here is an experience I have: ${experienceString}\n
                                    Generate a list of at most 5 bullet points that describe this experience.\n
                                    DO NOT LIE. DO NOT INCLUDE ANYTHING THAT IS NOT TRUE.\n
                                    However, make the points relevant to the job posting.\n
                                    Return this data as a list of sentences seperated by new lines.\n
                                    Do not send any text other than the sentences themselves.\n`;
    const expResp = await vertex.generateContent(experiencePointsPrompt);
    const expContent = expResp.response;
    const points = expContent.candidates.at(0).content.parts.at(0).text.split("\n");
    const startDateString = formatDate(experience.startDate);
    const endDateString = experience.endDate ? formatDate(experience.endDate) : "Present";
    resumeExperiences.push({
      position: experience.position,
      company: experience.company,
      startDate: startDateString,
      endDate: endDateString,
      points,
    });
  }
  return resumeExperiences;
}

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
    const jobDataString = createJobDataString(jobData);
    const balance = await getUserBalance(userId);
    const modelParam = req.query.model || "gemini-flash-1.5";
    const model = ModelLabelToVersion[modelParam] || "gemini-1.5-flash-001";
    const cost = ModelToCost[model];
    if (balance < cost)
      return res
        .status(HttpStatusCode.BadRequest)
        .json(
          new ApiResponse(
            HttpStatusCode.BadRequest,
            "Insufficient credits to generate a resume with the selected model.",
          ),
        );
    // Creating an instance of the VertexAI client
    const vertexAI = new VertexAI({ project: PROJECT_ID, location: REGION });
    const generativeModel = vertexAI.getGenerativeModel({
      model: model,
    });
    // Creating a resume object
    const resume = new Resume(user.fname, user.lname, user.email);
    // Objective
    const objective = await generateResumeObjective(generativeModel, jobDataString);
    resume.setObjective(objective);
    // Skills
    const resumeSkills = await generateResumeSkills(generativeModel, jobDataString, skills);
    resume.setSkills(resumeSkills);
    // Education
    const resumeEducations = await generateResumeEducations(generativeModel, jobDataString, educations);
    resume.setEducations(resumeEducations);
    // Experiences
    const resumeExperiences = await generateResumeExperiences(generativeModel, jobDataString, experiences);
    resume.setExperiences(resumeExperiences);
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

