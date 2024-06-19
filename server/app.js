import { sequelize } from "./datasource.js";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import "dotenv/config";
import { usersRouter } from "./routers/users_router.js";

const PORT = 3000;
export const app = express();
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SECRET_KEY, // this is important! do not define the secret before
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static("static"));
try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.use("/users", usersRouter)

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
