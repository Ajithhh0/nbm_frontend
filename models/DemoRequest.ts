import mongoose from "mongoose";

const DemoRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    ip: String,
    purpose: String,

    status: {
      type: String,
      enum: ["new", "contacted", "responded"],
      default: "new",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.DemoRequest ||
  mongoose.model("DemoRequest", DemoRequestSchema);
