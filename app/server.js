const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Parse JSON bodies
app.use(express.json());

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// MongoDB URL from environment
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/my-db";

if (!mongoUrl) {
  console.error("MONGO_URL environment variable not set");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");

    // Start server after DB connects
    app.listen(3000, () => {
      console.log("App running on port 3000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// MongoDB Schema & Model
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", UserSchema);

// Root route — serve index.html explicitly
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// GET profile
app.get("/api/profile", async (req, res) => {
  try {
    let user = await User.findOne();

    if (!user) {
      user = await User.create({
        name: "John Doe",
        email: "john@example.com",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// UPDATE profile
app.put("/api/profile", async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findOneAndUpdate(
      {},
      { name, email },
      { new: true, upsert: true },
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});
