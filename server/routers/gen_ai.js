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
import { generateCoverLetterBrown } from "../services/docx.js";
import { CoverLetter } from "../entities/cover-letter.js";
import fs from "fs";

const PROJECT_ID = process.env.PROJECT_ID;
const REGION = process.env.GOOGLE_REGION;
const VERTEX_MODEL = process.env.VERTEX_MODEL;

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

const extractCoverLetterData = (paragraphs = []) => {
  let letterParagraphs = [];
  for (let i = 0; i < paragraphs.length; i++)
    letterParagraphs[i] = paragraphs[i];
  if (paragraphs.length > 4)
    letterParagraphs[3] = paragraphs[paragraphs.length - 1];
  return new CoverLetter('', '', '', '', '', '', '', '', '', letterParagraphs);
}

genAiRouter.post("/letter", isAuthenticated, setUserId, async (req, res) => {
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
  const experiencesString = createUserExperienceString(experiences);
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
    model: VERTEX_MODEL,
  });
  const resp = await generativeModel.generateContent(prompt);
  const content = resp.response;
  const result = content.candidates.at(0).content.parts.at(0).text.split("\n");
  const coverLetter = extractCoverLetterData(result);
  const letterPath = await generateCoverLetterBrown(coverLetter);
  // Checks if letterPath exists and leads to a real file
  console.log(`${fs.existsSync(letterPath) ? 'File exists' : 'File does not exist'} - ${letterPath}`);

  // Returning the generated cover letter as a docx file over Express
  return res.download(letterPath, coverLetter.getLetterName());
});
