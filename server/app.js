import { sequelize } from "./datasource.js";
import express from "express";
import "dotenv/config";
import { usersRouter } from "./routers/users_router.js";
import { skillsRouter } from "./routers/skills_router.js";
import cors from "cors";
import { jobsRouter } from "./routers/jobs_router.js";
import { genAiRouter } from "./routers/gen_ai.js";
import { authRouter } from "./routers/auth_router.js";
import { productsRouter } from "./routers/products_router.js";
import { stripeRouter } from "./routers/stripe_router.js";
import { errorHandler } from "./middleware/errors.js";
import { dropdownRouter } from "./routers/dropdown_router.js";

const PORT = process.env.PORT || 3000;
export const app = express();

const corsOptions = {
  origin: process.env.CLIENT_BASE_URL || "http://localhost:4200",
  credentials: true,
};
app.use(cors(corsOptions));

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.use("/api/users", express.json(), usersRouter);
app.use("/api/jobs", express.json(), jobsRouter);
app.use("/api/skills", express.json(), skillsRouter);
app.use("/api/gen-ai", express.json(), genAiRouter);
app.use("/api/auth", express.json(), authRouter);
app.use("/api/products", express.json(), productsRouter);
app.use("/api/stripe", stripeRouter);
app.use("/api/dropdown", express.json(), dropdownRouter);

app.use(errorHandler);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on port %s", PORT);
});
