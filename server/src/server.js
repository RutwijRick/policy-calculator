import dotenv from "dotenv";
import app from "./app.js";
import { sequelize } from "./models/index.js";

dotenv.config({ path: "./.env" }); 

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully.");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Unable to connect to the database:", error);
    }
})();
