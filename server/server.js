import express from "express";
import cors from "cors";
import connectToMongo from "./db.js";
import projectRoutes from './api/routes/project.routes.js';
import requestLogger from './api/middleware/logging.middleware.js';

const app = express();
const PORT = process.env.PORT || 2000;

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// API Routes
app.use('/api/projects', projectRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: 'OK', message: "Server is running", timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("❌ Unhandled Error:", err);
    res.status(500).json({ status: "error", message: "An unexpected error occurred." });
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