import mongoose, { Schema } from 'mongoose';
import { ITask } from '../interfaces/models';

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'archived'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    deadline: { type: String }, // Storing as ISO string to match interface
    assignedTo: { type: String }, // We'll keep these as strings for now to match current service logic, or use Schema.Types.ObjectId if we want stricter DB links
    assignedBy: { type: String },
    projectId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
