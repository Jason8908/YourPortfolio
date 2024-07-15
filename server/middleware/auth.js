import { Session } from "../models/sessions.js";
import { ApiResponse } from "../entities/response.js";
import { User } from "../models/users.js";
import { Stripe } from "stripe";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function isAuthenticated(req, res, next) {
  // Check if the request has a Bearer access token in its authorization header.
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json(
        new ApiResponse(401, "Unauthorized. Missing authorization header."),
      );
  }
  // Extract the access token from the authorization header.
  const accessToken = authHeader.split(" ")[1];
  // Check if the access token exists in the database.
  const session = await Session.findByPk(accessToken);
  if (!session) {
    return res
      .status(401)
      .json(new ApiResponse(401, "Unauthorized. Invalid access token."));
  }
  // If token is expired, remove it from the database and return 401.
  if (session.expiresAt < new Date()) {
    await session.destroy();
    return res
      .status(401)
      .json(new ApiResponse(401, "Unauthorized. Expired access token."));
  }
  // Ensure user exists in the database.
  const userId = session.userId;
  const user = await User.findByPk(userId);
  if (!user) {
    return res
      .status(401)
      .json(new ApiResponse(401, "Unauthorized. User not found."));
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

export async function setUserInfo(req, res, next) {
  // Sets the userId field in the req object given that isAuthenticated has already been called and a valid token has been provided
  const authHeader = req.headers.authorization;
  const accessToken = authHeader.split(" ")[1];
  const session = await Session.findByPk(accessToken, {
    include: {
      association: "User",
      attributes: ["id", "email", "fname", "lname"],
    },
  });
  if (!session || !session.User) {
    return res.status(401).json({
      message: "Unauthorized. User not found with provided access token.",
    });
  }
  req.user = {
    id: session.User.id,
    email: session.User.email,
    fname: session.User.fname,
    lname: session.User.lname,
  };
  next();
}

export async function verifyStripeWebhook(req, res, next) {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log(err.message);
    return res
      .status(400)
      .json(new ApiResponse(400, `Webhook Error: ${err.message}`));
  }
  req.stripeEvent = event;
  return next();
}
