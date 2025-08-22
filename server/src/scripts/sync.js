import { sequelize } from "../models/index.js";

(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("✅ Database synced successfully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error syncing database:", error);
        process.exit(1);
    }
})();
