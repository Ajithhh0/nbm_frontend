import mongoose from "mongoose";

const DemoRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    ip: String,
  },
  { timestamps: true }
);

export default mongoose.models.DemoRequest ||
  mongoose.model("DemoRequest", DemoRequestSchema);
