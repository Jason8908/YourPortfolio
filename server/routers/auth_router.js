import { Router } from "express";
import "dotenv/config";
import { ApiResponse } from "../entities/response.js";
import { HttpStatusCode } from "axios";
import { google } from "googleapis";
import { jwtDecode } from "jwt-decode";
import { Session } from "../models/sessions.js";
import { randomBytes } from "crypto";
import { User } from "../models/users.js";

export const authRouter = Router();

const googleOAuthClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL,
);

const yourportRedirect = process.env.YOURPORT_AUTH_URL;

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const loginUrl = googleOAuthClient.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
});

const getUserInfo = async (jwt, refreshToken = null) => {
  const userInfo = jwtDecode(jwt);
  let user = await User.findOne({ where: { email: userInfo.email } });
  if (user === null) {
    user = await User.create({
      email: userInfo.email,
      fname: userInfo.given_name,
      lname: userInfo.family_name,
    });
  }
  if (refreshToken) {
    user.googleRefreshToken = refreshToken;
    await user.save();
  }
  return user;
};

// Create a cryptographically secure random bearer token
const generateBearerToken = () => {
  return randomBytes(32).toString("hex");
};

authRouter.get("/login/google", (req, res) => {
  return res.redirect(loginUrl);
});

authRouter.get("/redirect/google", async (req, res) => {
  const code = req.query.code;
  if (!code)
    return res
      .status(HttpStatusCode.Unauthorized)
      .json(
        new ApiResponse(
          HttpStatusCode.Unauthorized,
          "Google login failed. Missing code query parameter.",
        ),
      );

  try {
    const { tokens } = await googleOAuthClient.getToken(code);

    const user = await getUserInfo(tokens.id_token, tokens.refresh_token);
    const bearerToken = generateBearerToken();

    const session = await Session.create({
      id: bearerToken,
      accessToken: tokens.access_token,
      expiresAt: new Date(tokens.expiry_date),
      userId: user.id,
    });

    return res.redirect(`${yourportRedirect}/?token=${session.id}`);
  } catch (err) {
    console.log(err);
    return res
      .status(HttpStatusCode.Unauthorized)
      .json(
        new ApiResponse(HttpStatusCode.Unauthorized, "Google login failed"),
      );
  }
});

authRouter.get("/login", (req, res) => {
  res
    .status(HttpStatusCode.Unauthorized)
    .json(new ApiResponse(HttpStatusCode.Unauthorized, "Google login failed"));
});
