import { Schema, model, models } from "mongoose";

export interface INews {
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, default: "update" },
  },
  { timestamps: true }
);

const News = models.News || model<INews>("News", NewsSchema);

export default News;
