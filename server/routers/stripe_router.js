import { Router } from "express";
import "dotenv/config";
import express from "express";
import { ApiResponse } from "../entities/response.js";
import { HttpStatusCode } from "axios";
import { Stripe } from "stripe";
import {
  isAuthenticated,
  setUserInfo,
  verifyStripeWebhook,
} from "../middleware/auth.js";
import { ProductTypes, Product } from "../models/products.js";
import { Balance } from "../models/balance.js";

const stripe = new Stripe(process.env.STRIPE_KEY);
const clientBaseUrl = process.env.CLIENT_BASE_URL;

export const stripeRouter = Router();

stripeRouter.post(
  "/checkout",
  express.json(),
  isAuthenticated,
  setUserInfo,
  async (req, res, next) => {
    const priceId = req.body.priceId;
    if (!priceId)
      return res
        .status(HttpStatusCode.BadRequest)
        .json(new ApiResponse(HttpStatusCode.BadRequest, "Missing priceId."));
    const email = req.user.email;
    const success_url = `${clientBaseUrl}/dashboard/`;
    const cancel_url = `${clientBaseUrl}/dashboard/pricing`;
    try {
      const product = await Product.findOne({ where: { priceId } });
      if (!product)
        return res
          .status(HttpStatusCode.BadRequest)
          .json(new ApiResponse(HttpStatusCode.BadRequest, "Invalid priceId."));
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        metadata: {
          userId: req.user.id,
          productType: ProductTypes.TopUp,
          value: product.value,
        },
        mode: "payment",
        success_url,
        cancel_url,
        customer_email: email,
      });
      return res
        .status(HttpStatusCode.Ok)
        .json(new ApiResponse(HttpStatusCode.Ok, "", session.url));
    } catch (err) {
      return next(err);
    }
  },
);

stripeRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  verifyStripeWebhook,
  async (req, res, next) => {
    // Handling required cases
    const event = req.stripeEvent;
    try {
      switch (event.type) {
        case "checkout.session.completed":
          const productType = event.data.object.metadata.productType;
          const userId = +event.data.object.metadata.userId;
          if (productType === ProductTypes.TopUp) {
            const topUpAmount = +event.data.object.metadata.value;
            let balance = await Balance.findOne({ where: { userId } });
            if (!balance)
              balance = await Balance.create({ userId, credits: topUpAmount });
            else balance.credits += topUpAmount;
            await balance.save();
          }
          return res
            .status(HttpStatusCode.Ok)
            .json(
              new ApiResponse(HttpStatusCode.Ok, "Checkout session completed."),
            );
        default:
          return res
            .status(HttpStatusCode.Ok)
            .json(new ApiResponse(HttpStatusCode.Ok, "Unhandled event type"));
      }
    } catch (err) {
      console.log(err);
      return next(err);
    }
  },
);
