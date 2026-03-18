import mongoose, { Schema, Document } from "mongoose";

export interface IResume extends Document {
  userId: string;
  score: number;
  missingSkills: string[];
  suggestions: string[];
  createdAt: Date;
}

const ResumeSchema = new Schema<IResume>({
  userId: { type: String, required: true, index: true },
  score: { type: Number, required: true },
  missingSkills: [{ type: String }],
  suggestions: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export const Resume =
  mongoose.models.Resume || mongoose.model<IResume>("Resume", ResumeSchema);
