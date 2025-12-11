import mongoose, { Schema, models } from "mongoose";

const NewsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true, // rich text / markdown
    },
    category: {
      type: String,
      enum: ["update", "research", "release", "announcement"],
      default: "update",
    },
    slug: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const News = models.News || mongoose.model("News", NewsSchema);
