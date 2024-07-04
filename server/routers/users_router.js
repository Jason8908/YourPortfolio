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

const bulkDeleteUserSkills = async (userId, skills) => {
  const skillIds = skills.map((skill) => skill.id);
  return await UserSkill.destroy({
    where: {
      userId,
      skillId: skillIds,
    },
  });
};

const bulkAddUserSkills = async (userId, skills) => {
  const userSkills = skills.map((skill) => ({ userId, skillId: skill.id }));
  return await UserSkill.bulkCreate(userSkills);
};

const bulkCreateAddUserSkills = async (userId, skills) => {
  const toCreate = skills.map((skill) => ({ skillName: skill.name }));
  const createdSkills = await Skill.bulkCreate(toCreate, { returning: true });
  const toInsert = createdSkills.map((skill) => ({
    userId,
    skillId: skill.id,
  }));
  return await UserSkill.bulkCreate(toInsert);
};

// User skills
usersRouter.get("/:id/skills", isAuthenticated, setUserId, async (req, res) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  const userId = +req.params.id;
  // Verify the user exists
  const user = await User.findByPk(userId);
  if (!user)
    return res.status(404).json(new ApiResponse(404, "User not found."));
  // Verify the user is the same as the one authenticated
  if (userId != req.userId)
    return res
      .status(403)
      .json(
        new ApiResponse(403, "Forbidden: You can only view your own skills."),
      );
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

usersRouter.put("/:id/skills", isAuthenticated, setUserId, async (req, res) => {
  const skills = req.body.skills;
  const userId = +req.params.id;
  let toDelete = [],
    toAdd = [],
    toCreate = [];
  // Verify the user exists
  const user = await User.findByPk(userId);
  if (!user)
    return res.status(404).json(new ApiResponse(404, "User not found."));
  // Verify the user is the same as the one authenticated
  if (userId != req.userId)
    return res
      .status(403)
      .json(
        new ApiResponse(403, "Forbidden: You can only update your own skills."),
      );
  // Running validations on skills
  if (!skills)
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          "Missing information: Must provide a list of skills.",
        ),
      );
  if (!Array.isArray(skills))
    return res
      .status(400)
      .json(
        new ApiResponse(400, "Invalid information: skills must be an array."),
      );
  // Check if all operations are either 'add' or 'remove'
  for (const skill of skills) {
    if (
      skill.operation !== operations.Add &&
      skill.operation !== operations.Remove
    )
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            "Invalid information: operation must be either 'add' or 'remove' for all skills.",
          ),
        );
    if (skill.operation === operations.Add)
      if (skill.id === undefined) toCreate.push(skill);
      else toAdd.push(skill);
    else toDelete.push(skill);
  }
  try {
    await bulkDeleteUserSkills(userId, toDelete);
    await bulkAddUserSkills(userId, toAdd);
    await bulkCreateAddUserSkills(userId, toCreate);
    const status = toAdd.length > 0 ? 201 : 200;
    return res
      .status(status)
      .json(new ApiResponse(status, "Skills updated successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal server error.", error.message));
  }
});

usersRouter.delete(
  "/:id/skills/:skillId",
  isAuthenticated,
  setUserId,
  async (req, res) => {
    const userId = +req.params.id;
    const skillId = +req.params.skillId;
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
            "Forbidden: You can only update your own skills.",
          ),
        );
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
  "/:id/skills",
  isAuthenticated,
  setUserId,
  async (req, res) => {
    const userId = +req.params.id;
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
            "Forbidden: You can only update your own skills.",
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
  "/:id/interests",
  isAuthenticated,
  setUserId,
  async (req, res) => {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const userId = +req.params.id;
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
            "Forbidden: You can only view your own interests.",
          ),
        );
    // Get the user's interests
    const results = await UserInterest.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["interest", "ASC"]],
    });
    const totalCount = results.count;
    const interests = results.rows;
    res.status(200).json(new ApiResponse(200, "", { totalCount, interests }));
  },
);

usersRouter.post(
  "/:id/interests",
  isAuthenticated,
  setUserId,
  async (req, res) => {
    const userId = +req.params.id;
    const interest = req.body.interest;
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
            "Forbidden: You can only update your own interests.",
          ),
        );
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
  "/:id/interests/:interestId",
  isAuthenticated,
  setUserId,
  async (req, res) => {
    const userId = +req.params.id;
    const interestId = req.params.interestId;
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
            "Forbidden: You can only update your own interests.",
          ),
        );
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
  "/:id/experiences",
  isAuthenticated,
  setUserId,
  async (req, res) => {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const userId = +req.params.id;
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
            "Forbidden: You can only view your own experiences.",
          ),
        );
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
  "/:id/experiences",
  isAuthenticated,
  setUserId,
  async (req, res) => {
    const userId = +req.params.id;
    const { company, position, startDate, endDate, description } = req.body;
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

usersRouter.delete(
  "/:id/experiences/:experienceId",
  isAuthenticated,
  setUserId,
  async (req, res) => {
    const userId = +req.params.id;
    const experienceId = req.params.experienceId;
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
