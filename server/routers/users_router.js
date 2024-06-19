import { User } from "../models/users.js";
import { Router } from "express";
import bcrypt from "bcrypt";

export const usersRouter = Router();

usersRouter.post("/signup", async (req, res) => {
  const user = User.build({
    email: req.body.email,
  });

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(req.body.password, salt);

  user.password = hash;

  try {
    await user.save();
  } catch {
    return res.status(422).json({ error: "User creation failed." });
  }

  req.session.email = user.email;

  return res.json({
    email: user.email,
  });
});

usersRouter.post("/signin", async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (user === null) {
    return res.status(401).json({ error: "Incorrect email or password." });
  }

  const hash = user.password; // Load hash from your password DB.
  const password = req.body.password; // this is the password passed in by the user

  // password incorrect
  if (!bcrypt.compareSync(password, hash)) {
    return res.status(401).json({ error: "Incorrect email or password." });
  }

  req.session.email = user.email;

  return res.json(user);
});

usersRouter.get("/signout", function (req, res, next) {
  req.session.email = null;
  return res.redirect("/");
});

usersRouter.get("/me", async (req, res) => {
  res.status(200).json({ email: req.session.email });
});
