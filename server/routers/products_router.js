import { Router } from "express";
import "dotenv/config";
import { ApiResponse } from "../entities/response.js";
import { HttpStatusCode } from "axios";
import { Product, ProductTypes } from "../models/products.js";

export const productsRouter = Router();

productsRouter.get("/topup", async (_, res) => {
  const options = await Product.findAll({
    where: { type: ProductTypes.TopUp },
  });
  const result = options.map((option) => {
    return {
      id: option.id,
      label: option.label,
      description: option.description,
      price: +option.price,
      currency: option.currency,
      priceId: option.priceId,
    };
  });
  return res
    .status(HttpStatusCode.Ok)
    .json(new ApiResponse(HttpStatusCode.Ok, "", result));
});
