import mongoose from "mongoose";

const TimelineSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Timeline ||
  mongoose.model("Timeline", TimelineSchema);
