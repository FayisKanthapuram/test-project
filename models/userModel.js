import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String },
  googleId: { type: String },
  avatar: { type: String }, // 👈 Google profile picture
  isBlock: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);
