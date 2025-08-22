// src/config/db.js
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_NAME || "benefitcalculator",
    process.env.DB_USER || "root",
    process.env.DB_PASS || "",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        logging: false,
    }
);

export default sequelize;
