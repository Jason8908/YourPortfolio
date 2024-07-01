import { User } from "../models/users.js";
import { Session } from "../models/sessions.js";
import { Router } from "express";
import { ApiResponse } from "../entities/response.js";
import { randomBytes } from "crypto";
import { isAuthenticated, setUserId } from "../middleware/auth.js";
import "dotenv/config";
import axios from 'axios';
export const usersRouter = Router();

const googleAPI = axios.create({
  baseURL: process.env.GOOGLE_API_URL
});

// Private function to decode a JWT.
const getTokenInfo = async (token) => {
  try {
    const response = await googleAPI.get('/tokeninfo', {
      params: { access_token: token }
    });
    return { status: response.status, data: response.data };
  }
  catch (error) {
    return { status: error.response.status };
  }
}

// Create a cryptographically secure random bearer token
const generateBearerToken = () => {
  return randomBytes(32).toString('hex');
}

usersRouter.get("/me", isAuthenticated, setUserId, async (req, res) => {
  const userId = req.userId;
  const user = await User.findByPk(userId);
  if (!user)
    return res.status(404).json(new ApiResponse(404, "User not found."));
  res.status(200).json(new ApiResponse(200, "", {
    id: user.id,
    firstName: user.fname,
    lastName: user.lname,
    email: user.email
  }));
});

usersRouter.post("/auth", async (req, res) => {
  // Get the required information from the body
  const {accessToken, firstName, lastName, email} = req.body;
  // If missing information
  if (!accessToken || !firstName || !lastName || !email)
    return res.status(400).json(new ApiResponse(400, "Missing information: Must provide an access token, first name, last name, and email."));
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
      return res.status(401).json(new ApiResponse(401, "Invalid or expired access token. Reauthentication required."));
    const expiry = new Date(Date.now() + tokenInfo.data.expires_in * 1000);
    const id = generateBearerToken();
    // Create a session for the user
    session = await Session.create({ id, accessToken, expiresAt: expiry, userId: user.id });
  }
  // Save the user and the session if everything looks good.
  await user.save();
  await session.save();
  // Respond with the user's bearer token.
  res.status(201).json(new ApiResponse(201, "User authenticated successfully.", {
    tokenType: "Bearer",
    accessToken: session.id,
  }));
});
