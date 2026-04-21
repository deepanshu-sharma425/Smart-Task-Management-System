import mongoose, { Schema } from 'mongoose';
import { IProject } from '../interfaces/models';

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    ownerId: { type: String, required: true },
    memberIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
