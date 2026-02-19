const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Use env variable OR fallback to localhost for testing
// const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/my-db";

const mongoUrl =
  process.env.MONGO_URL ||
  "mongodb://admin:pass@localhost:27017/my-db?authSource=admin";

mongoose
  .connect(mongoUrl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", UserSchema);

// POST — Save user
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  const newUser = new User({ name, email });
  await newUser.save();

  const users = await User.find();
  res.json(users); // return all users after saving
});

// GET — Get all users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
