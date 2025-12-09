import mongoose, { Schema, models } from "mongoose";

const NewsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const News = models.News || mongoose.model("News", NewsSchema);
