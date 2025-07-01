import express from "express";
import cors from "cors";
import connectToMongo from "./db.js";

import Entry from "./models/Entry.js";

const app = express();

const PORT = 2000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Mongo
await connectToMongo();

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: 'OK', message: "Server is running", timestamp: new Date().toISOString() });
});

// GET /api/entry/:ss58Address
app.get("/api/entry/:ss58Address", async (req, res) => {
    try {
        const ss58Address = req.params.ss58Address;
        const entry = await Entry.findOne({ ss58Address });

        if (!entry) {
            return res.status(404).json({ status: "error", message: "Entry not found" });
        }

        res.status(200).json({ status: "success", data: entry });
    } catch (err) {
        console.error("❌ Error fetching entry:", err);
        res.status(500).json({ status: "error", message: "Server error" });
    }
});

app.post("/api/entry", async (req, res) => {
    try {
        console.log(req.body);
        const { ss58Address, ...entryData } = req.body;

        if (!ss58Address) {
            return res.status(400).json({ status: "error", message: "ss58Address is required" });
        }

        const updated = await Entry.findOneAndUpdate(
            { ss58Address },
            { ss58Address, ...entryData },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ status: "success", data: updated });
    } catch (error) {
        console.error("❌ Error saving entry:", error);
        res.status(500).json({ status: "error", message: "Failed to save entry" });
    }
});

const startServer = async () => {
    try {
        // await connectToMongo();
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