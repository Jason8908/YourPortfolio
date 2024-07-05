import { sequelize } from "./datasource.js";
import express from "express";
import { usersRouter } from "./routers/users_router.js";
import { skillsRouter } from "./routers/skills_router.js";
import cors from "cors";
import { jobsRouter } from "./routers/jobs_router.js";
import { genAiRouter } from "./routers/gen_ai.js";

const PORT = 3000;
export const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:4200",
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

app.use("/api/users", usersRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/gen-ai", genAiRouter);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
