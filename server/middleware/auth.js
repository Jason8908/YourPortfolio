import { Session } from "../models/sessions.js";
import { ApiResponse } from "../entities/response.js";

export async function isAuthenticated(req, res, next) {
  // Check if the request has a Bearer access token in its authorization header.
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json(new ApiResponse(401, "Unauthorized. Missing authorization header."));
  }
  // Extract the access token from the authorization header.
  const accessToken = authHeader.split(" ")[1];
  // Check if the access token exists in the database.
  const session = await Session.findByPk(accessToken);
  if (!session) {
    return res.status(401).json(new ApiResponse(401, "Unauthorized. Invalid access token."));
  }
  // If token is expired, remove it from the database and return 401.
  if (session.expiresAt < new Date()) {
    await session.destroy();
    return res.status(401).json(new ApiResponse(401, "Unauthorized. Expired access token."));
  }
  next();
}

export async function setUserId(req, res, next) {
  // Sets the userId field in the req object given that isAuthenticated has already been called and a valid token has been provided
  const authHeader = req.headers.authorization;
  const accessToken = authHeader.split(" ")[1];
  const session = await Session.findByPk(accessToken);
  if (!session) {
    return res.status(401).json({
      message: "Unauthorized. User not found with provided access token.",
    });
  }
  req.userId = session.userId;
  next();
}