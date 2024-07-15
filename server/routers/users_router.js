import { User } from "../models/users.js";
import { UserSkill } from "../models/userSkills.js";
import { Skill } from "../models/skills.js";
import { Session } from "../models/sessions.js";
import { UserInterest } from "../models/userinterests.js";
import { Router } from "express";
import { ApiResponse } from "../entities/response.js";
import { randomBytes } from "crypto";
import { isAuthenticated, setUserId } from "../middleware/auth.js";
import { UserExperience } from "../models/userexperiences.js";
import { Op } from "sequelize";
import { Balance } from "../models/balance.js";
import { UserEducation } from "../models/usereducation.js";
import "dotenv/config";
import axios from "axios";
export const usersRouter = Router();

const googleAPI = axios.create({
  baseURL: process.env.GOOGLE_API_URL,
});

const operations = {
  Add: "add",
  Remove: "remove",
};

// Private function to decode a JWT.
const getTokenInfo = async (token) => {
  try {
    const response = await googleAPI.get("/tokeninfo", {
      params: { access_token: token },
    });
    return { status: response.status, data: response.data };
  } catch (error) {
    return { status: error.response.status };
  }
};

// Create a cryptographically secure random bearer token
const generateBearerToken = () => {
  return randomBytes(32).toString("hex");
};

usersRouter.get("/me", isAuthenticated, setUserId, async (req, res) => {
  const userId = req.userId;
  const user = await User.findByPk(userId);
  if (!user)
    return res.status(404).json(new ApiResponse(404, "User not found."));
  res.status(200).json(
    new ApiResponse(200, "", {
      id: user.id,
      firstName: user.fname,
      lastName: user.lname,
      email: user.email,
    }),
  );
});

usersRouter.post("/auth", async (req, res) => {
  // Get the required information from the body
  const { accessToken, firstName, lastName, email } = req.body;
  // If missing information
  if (!accessToken || !firstName || !lastName || !email)
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          "Missing information: Must provide an access token, first name, last name, and email.",
        ),
      );
  // Check if there already is a user with the same email
  let user = await User.findOne({ where: { email } });
  // If there is no user with the same email, create one
  if (!user)
    user = await User.create({ fname: firstName, lname: lastName, email });
  // Check if there's already a session for the user's access token
  let session = await Session.findOne({ where: { accessToken } });
  if (!session) {
    // Verifying the access token is valid through Google's API
    const tokenInfo = await getTokenInfo(accessToken);
    // If the token is invalid
    if (tokenInfo.status !== 200)
      return res
        .status(401)
        .json(
          new ApiResponse(
            401,
            "Invalid or expired access token. Reauthentication required.",
          ),
        );
    const expiry = new Date(Date.now() + tokenInfo.data.expires_in * 1000);
    const id = generateBearerToken();
    // Create a session for the user
    session = await Session.create({
      id,
      accessToken,
      expiresAt: expiry,
      userId: user.id,
    });
  }
  // Save the user and the session if everything looks good.
  await user.save();
  await session.save();
  // Respond with the user's bearer token.
  res.status(201).json(
    new ApiResponse(201, "User authenticated successfully.", {
      tokenType: "Bearer",
      accessToken: session.id,
    }),
  );
});

// User skills
usersRouter.get("/skills", isAuthenticated, setUserId, async (req, res) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  const userId = req.userId;
  // Get the user's skills
  const results = await UserSkill.findAndCountAll({
    where: { userId },
    limit: limit,
    offset: offset,
    include: Skill,
    order: [[Skill, "skillName", "ASC"]],
  });
  const totalCount = results.count;
  const skills = results.rows.map((userSkill) => ({
    id: userSkill.Skill.id,
    name: userSkill.Skill.skillName,
  }));
  res.status(200).json(new ApiResponse(200, "", { totalCount, skills }));
});

usersRouter.delete(
  "/skills/:skillId",
  isAuthenticated,
  setUserId,
  async (req, res) => {
    const skillId = +req.params.skillId;
    const userId = req.userId;
    // Verify the skill exists
    const skill = await Skill.findByPk(skillId);
    if (!skill)
      return res.status(404).json(new ApiResponse(404, "Skill not found."));
    // Verify the user has the skill
    const userSkill = await UserSkill.findOne({
      where: {
        userId,
        skillId,
      },
    });
    if (!userSkill)
      return res
        .status(404)
        .json(new ApiResponse(404, "User does not have the specified skill."));
    // Delete the user skill
    await userSkill.destroy();
    res.status(200).json(new ApiResponse(200, "Skill removed successfully."));
  },
);

usersRouter.post(
  "/skills",
  isAuthenticated,
  setUserId,
  async (req, res) => {
    const userId = req.userId;
    const skillName = req.body.skillName;
    let skillId = +(req.body.skillId !== undefined ? req.body.skillId : -1);
    // If the user has not provided a skill name or id
    if (!skillName && skillId === -1)
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            "Missing information: Must provide a skill name or id.",
          ),
        );
    // If the skillId is not provided
    let skill = undefined;
    if (skillId === -1) {
      // Search for the skill name
      skill = await Skill.findOne({
        where: { skillName: { [Op.iLike]: skillName } },
      });
      // If the skill does not exist, create it
      if (!skill) {
        skill = await Skill.create({ skillName });
        skillId = skill.id;
      } else skillId = skill.id;
    }
    // Verify the skill exists
    skill = await Skill.findByPk(skillId);
    if (!skill)
      return res.status(404).json(new ApiResponse(404, "Skill not found."));
    // Verify the user does not have the skill
    const userSkill = await UserSkill.findOne({
      where: {
        userId,
        skillId,
      },
    });
    if (userSkill)
      return res
        .status(409)
        .json(new ApiResponse(409, "User already has the specified skill."));
    // Create the user skill
    await UserSkill.create({ userId, skillId });
    res.status(201).json(new ApiResponse(201, "Skill added successfully."));
  },
);

// USER INTERESTS

usersRouter.get(
  "/interests",
  isAuthenticated,
  setUserId,
  async (req, res) => {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const userId = req.userId;
    // Get the user's interests
    const results = await UserInterest.findAndCountAll({
      limit: limit,
      offset: offset,
      where: { userId },
      order: [["interest", "ASC"]],
    });
    const totalCount = results.count;
    const interests = results.rows;
    res.status(200).json(new ApiResponse(200, "", { totalCount, interests }));
  },
);

usersRouter.post(
  "/interests",
  isAuthenticated,
  setUserId,
  async (req, res) => {
    const userId = req.userId;
    const interest = req.body.interest;
    // Verify the interest is provided
    if (!interest)
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            "Missing information: Must provide an interest.",
          ),
        );
    // Create the user interest
    await UserInterest.create({ userId, interest });
    res.status(201).json(new ApiResponse(201, "Interest added successfully."));
  },
);

usersRouter.delete(
  "/interests/:interestId",
  isAuthenticated,
  setUserId,
  async (req, res) => {
    const userId = +req.userId;
    const interestId = req.params.interestId;
    // Verify the interestId is provided
    if (!interestId)
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            "Missing information: Must provide an interest.",
          ),
        );
    // Verify the interest exists
    const userInterest = await UserInterest.findOne({
      where: {
        userId,
        id: interestId,
      },
    });
    if (!userInterest)
      return res
        .status(404)
        .json(
          new ApiResponse(404, "User does not have the specified interest."),
        );
    // Delete the user interest
    await userInterest.destroy();
    res
      .status(200)
      .json(new ApiResponse(200, "Interest removed successfully."));
  },
);

// USER EXPERIENCES

usersRouter.get(
  "/experiences",
  isAuthenticated,
  setUserId,
  async (req, res) => {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const userId = +req.userId;
    // Get the user's experiences
    const results = await UserExperience.findAndCountAll({
      where: { userId },
      limit: limit,
      offset: offset,
      order: [["startDate", "DESC"]],
    });
    const totalCount = results.count;
    const experiences = results.rows.map((experience) => ({
      id: experience.id,
      company: experience.company,
      position: experience.position,
      startDate: experience.startDate,
      endDate: experience.endDate,
      description: experience.description,
    }));
    res.status(200).json(new ApiResponse(200, "", { totalCount, experiences }));
  },
);

usersRouter.post(
  "/experiences",
  isAuthenticated,
  setUserId,
  async (req, res) => {
    const userId = +req.userId;
    const { company, position, startDate, endDate, description } = req.body;
    // Verify the required information is provided
    if (!company || !position || !startDate)
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            "Missing information: Must provide a company, position, and start date.",
          ),
        );
    // Create the user experience
    await UserExperience.create({
      userId,
      company,
      position,
      startDate,
      endDate,
      description,
    });
    res
      .status(201)
      .json(new ApiResponse(201, "Experience added successfully."));
  },
);

usersRouter.patch(
  "/experiences",
  isAuthenticated,
  setUserId,
  async (req, res) => {
    const userId = +req.userId;
    const { id, company, position, startDate, endDate, description } = req.body;
    // Verify the user exists
    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json(new ApiResponse(404, "User not found."));
    // Verify the user is the same as the one authenticated
    if (userId != req.userId)
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            "Forbidden: You can only update your own experiences.",
          ),
        );
    // Verify the required information is provided
    if (!id)
      return res
        .status(400)
        .json(new ApiResponse(400, "Missing information: Must provide ID"));

    let userExperience = await UserExperience.findByPk(id);

    // Create the user experience
    await userExperience.update({
      userId,
      company,
      position,
      startDate,
      endDate,
      description,
    });

    await userExperience.save();

    res
      .status(200)
      .json(new ApiResponse(200, "Experience added successfully."));
  },
);

usersRouter.delete(
  "/experiences/:experienceId",
  isAuthenticated,
  setUserId,
  async (req, res) => {
    const userId = +req.userId;
    const experienceId = req.params.experienceId;
    // Verify the experienceId is provided
    if (!experienceId)
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            "Missing information: Must provide an experience.",
          ),
        );
    // Verify the experience exists
    const userExperience = await UserExperience.findOne({
      where: {
        userId,
        id: experienceId,
      },
    });
    if (!userExperience)
      return res
        .status(404)
        .json(
          new ApiResponse(404, "User does not have the specified experience."),
        );
    // Delete the user experience
    await userExperience.destroy();
    res
      .status(200)
      .json(new ApiResponse(200, "Experience removed successfully."));
  },
);

// USER BALANCE

usersRouter.get("/balance", isAuthenticated, setUserId, async (req, res) => {
  let userBalance = await Balance.findOne({ where: { userId: req.userId } });
  if (!userBalance) {
    userBalance = await Balance.create({ userId: req.userId });
    await userBalance.save();
  }
  const result = {
    userId: req.userId,
    credits: userBalance.credits,
  };
  return res.status(200).json(new ApiResponse(200, "", result));
});

// USER EDUCATION

usersRouter.get("/education", isAuthenticated, setUserId, async (req, res) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  const userId = req.userId;
  // Get the user's education history
  const results = await UserEducation.findAndCountAll({
    where: { userId },
    limit: limit,
    offset: offset,
    order: [["startDate", "DESC"]],
  });
  const totalCount = results.count;
  const educations = results.rows.map((education) => ({
    id: education.id,
    school: education.school,
    degree: education.degree,
    major: education.major,
    startDate: education.startDate,
    endDate: education.endDate,
    gpa: education.gpa,
    description: education.description,
    degreeSpecs: [education.degree, education.major].filter(x=>x).join(", ")
  }));
  res.status(200).json(new ApiResponse(200, "", { totalCount, educations }));
});

usersRouter.post("/education", isAuthenticated, setUserId, async (req, res) => {
  const userId = req.userId;
  const { school, degree, major, startDate, endDate, gpa, description } = req.body;
  // Verify the required information is provided
  if (!school || !startDate)
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          "Missing information: Must provide a school name and start date.",
        ),
      );
  // Create the user education
  await UserEducation.create({
    userId,
    school,
    degree,
    major,
    startDate,
    endDate,
    gpa,
    description
  });
  res
    .status(201)
    .json(new ApiResponse(201, "Education added successfully."));
});

usersRouter.patch("/education/:id", isAuthenticated, setUserId, async (req, res) => {
  const userId = req.userId;
  const id = +(req.params.id);
  const { school, degree, major, startDate, endDate, gpa, description } = req.body;

  const userEducation = await UserEducation.findByPk(id);
  // Update the user education
  await userEducation.update({
    userId,
    school,
    degree,
    major,
    startDate,
    endDate,
    gpa,
    description
  });
  await userEducation.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Education added successfully."));
});

usersRouter.delete("/education/:educationId", isAuthenticated, setUserId, async (req, res) => {
  const educationId = req.params.educationId;
  const userId = req.userId;
  // Verify the educationId is provided
  if (!educationId)
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          "Missing information: Must provide an education.",
        ),
      );
  // Verify the education exists
  const userEducation = await UserEducation.findOne({
    where: {
      userId,
      id: educationId,
    },
  });
  if (!userEducation)
    return res
      .status(404)
      .json(
        new ApiResponse(404, "User does not have the specified education."),
      );
  // Delete the user education
  await userEducation.destroy();
  res
    .status(200)
    .json(new ApiResponse(200, "Education removed successfully."));
});
