import mongoose, { Schema } from 'mongoose';
import { INotification } from '../interfaces/models';

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true },
    type: {
      type: String,
      enum: ['task_assigned', 'task_completed'],
      required: true,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    relatedTaskId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
