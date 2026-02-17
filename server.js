const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/my-db";

if (!mongoUrl) {
    console.error("MONGO_URL environment variable not set");
    process.exit(1);
}

mongoose
    .connect(mongoUrl)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const User = mongoose.model("User", UserSchema);

// GET profile
app.get("/api/profile", async (req, res) => {
    let user = await User.findOne();

    if (!user) {
        user = await User.create({
            name: "John Doe",
            email: "john@example.com",
        });
    }

    res.json(user);
});

// UPDATE profile
app.put("/api/profile", async (req, res) => {
    const { name, email } = req.body;

    const user = await User.findOneAndUpdate(
        {},
        { name, email },
        { new: true },
    );

    res.json(user);
});

app.listen(3000, () => {
    console.log("App running on port 3000");
});
