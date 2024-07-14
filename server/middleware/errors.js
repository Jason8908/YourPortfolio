import { HttpStatusCode } from "axios";
import { ApiResponse } from "../entities/response.js";

export const errorHandler = (err, req, res, next) => {
  return res
    .status(HttpStatusCode.InternalServerError)
    .json(new ApiResponse(HttpStatusCode.InternalServerError, err.message));
};
