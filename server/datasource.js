import "dotenv/config";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.PSQL_DB,
  process.env.PSQL_USER,
  process.env.PSQL_PASS,
  {
    host: process.env.PSQL_IP,
    dialect: "postgres",
    logging: false,
  },
);
