import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToMongo from "./db.js";

dotenv.config();
const app = express();

// TODO: Set up environment variables for PORT and CORS_ORIGIN @deji
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: 'OK', message: "Server is running", timestamp: new Date().toISOString() });
});


const startServer = async () => {
    try {
        await connectToMongo();
        app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error starting server:", error);
        process.exit(1);
    }
}

await startServer();
export default app;