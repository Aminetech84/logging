const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());


// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Define task schema
const eventSchema = new mongoose.Schema({
    text: String,
    date: { type: Date, default: Date.now } 
});

const Event = mongoose.model("Event", eventSchema);

//  Get events
app.get("/api/events", async (req, res) => {
    try {
        const events = await Event.find().sort({ date: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new event
app.post("/api/events", async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an event
/*app.put("/api/events/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );
        if (!updatedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.json(updatedEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});*/

// Delete an event
app.delete("/api/events/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});